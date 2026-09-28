import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { PINNED_SCROLL } from '../lib/debug';
import { clamp, smoothstep } from '../lib/math';
import {
  drawTerminal,
  TERMINAL_H,
  TERMINAL_W,
  TOTAL_CHARS,
} from '../lib/terminal';
import { useDiscrete } from '../ScrollDriver';
import { chapterProgress, palette, setDiscrete, story } from '../state';

const CHARS_PER_SEC = 190;
/** 打完之后留一拍再放行，让最后那句提示看得清 */
const HOLD_AFTER_TYPING = PINNED_SCROLL === null ? 0.9 : 0;

interface Props {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
}

/**
 * boot 章的画面：一块贴着 canvas 的平面。
 * 这张 canvas 同时是 rewind 章粒子的采样源，所以文字是在原地碎掉的。
 */
const TerminalPlane: React.FC<Props> = ({ canvas, ctx, width }) => {
  const { theme } = useDiscrete();
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const [skipped, setSkipped] = useState(PINNED_SCROLL !== null);
  const typed = useRef(0);
  const held = useRef(0);
  const blink = useRef(0);
  const lastDrawn = useRef(-1);

  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas);
    t.minFilter = THREE.LinearFilter;
    t.generateMipmaps = false;
    return t;
  }, [canvas]);

  useEffect(() => () => texture.dispose(), [texture]);

  // 不耐烦的访客可以随时跳过开场
  useEffect(() => {
    if (story.booted) return;
    const skip = () => setSkipped(true);
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
  }, []);

  // 主题切换后画布上的字还是旧颜色，把缓存戳作废逼它重画一帧
  useEffect(() => {
    lastDrawn.current = -1;
  }, [theme]);

  useFrame((_, dt) => {
    if (!story.booted) {
      typed.current = skipped
        ? TOTAL_CHARS
        : Math.min(TOTAL_CHARS, typed.current + dt * CHARS_PER_SEC);
      blink.current += dt;

      if (typed.current >= TOTAL_CHARS) {
        held.current += dt;
        if (held.current > HOLD_AFTER_TYPING) {
          story.booted = true;
          setDiscrete({ booted: true });
        }
      }
    }

    const revealed = Math.floor(typed.current);
    const cursorOn = story.booted ? false : blink.current % 1 < 0.6;
    const stamp = revealed * 2 + (cursorOn ? 1 : 0);
    if (stamp !== lastDrawn.current) {
      lastDrawn.current = stamp;
      drawTerminal(ctx, revealed, cursorOn);
      texture.needsUpdate = true;
    }

    // 诗句开始倒流时屏幕本身先熄灭，粒子接管
    const fade = clamp(1 - smoothstep(0, 0.22, chapterProgress('rewind')));
    if (mat.current) mat.current.opacity = fade;
    if (mesh.current) mesh.current.visible = fade > 0.002;
  });

  const height = (width * TERMINAL_H) / TERMINAL_W;

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        ref={mat}
        map={texture}
        transparent
        depthWrite={false}
        blending={
          palette().additive ? THREE.AdditiveBlending : THREE.NormalBlending
        }
        key={theme}
      />
    </mesh>
  );
};

export default TerminalPlane;
