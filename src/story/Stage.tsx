import { Canvas, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { pick } from './lib/quality';
import CameraRig from './scenes/CameraRig';
import GlyphField from './scenes/GlyphField';
import Ground from './scenes/Ground';
import ProjectRing from './scenes/ProjectRing';
import Rain from './scenes/Rain';
import TerminalPlane from './scenes/TerminalPlane';
import { useDiscrete } from './ScrollDriver';
import { palette } from './state';

/** 场景底色。放在 Canvas 里才拿得到 scene，只在主题变化时改一次 */
const Backdrop: React.FC = () => {
  const { scene } = useThree();
  const { theme } = useDiscrete();
  const color = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    color.set(palette().bg);
    scene.background = color;
  }, [theme, color, scene]);

  return null;
};

interface Props {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

/**
 * 整条故事线只有这一个 WebGL 场景。各章不是「切页面」，
 * 而是同一批物体在同一个空间里被滚动推着改变状态。
 */
const Stage: React.FC<Props> = ({ canvas, ctx }) => {
  const [awake, setAwake] = useState(true);

  // 切到别的标签页时整条渲染循环停掉，笔记本不必为看不见的画面转风扇
  useEffect(() => {
    const sync = () => setAwake(!document.hidden);
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  return (
    <Canvas
      className="story-canvas"
      frameloop={awake ? 'always' : 'never'}
      dpr={pick<[number, number]>([1, 2], [1, 1.5])}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      camera={{ fov: 52, near: 0.1, far: 120, position: [0, 0, 9.6] }}
    >
      <Backdrop />
      <CameraRig />
      <TerminalPlane canvas={canvas} ctx={ctx} width={13} />
      <GlyphField terminal={canvas} />
      <Ground />
      <Rain />
      <Suspense fallback={null}>
        <ProjectRing />
      </Suspense>
    </Canvas>
  );
};

export default Stage;
