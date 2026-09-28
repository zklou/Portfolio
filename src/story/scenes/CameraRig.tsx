import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { CHAPTERS } from '../config';
import { clamp, damp, lerp, smoothstep } from '../lib/math';
import {
  CAMERA_RADIUS,
  CAMERA_Y,
  facingPanel,
  PANEL_RADIUS,
  yawAt,
} from '../lib/orbit';
import { chapterProgress, setDiscrete, story } from '../state';

/**
 * 相机用「位置 + 朝向角」描述，而不是 position + lookAt(点)。
 * 第 3→4 章要原地转身 180°，如果去插值注视点，注视点会从身后穿过机身，
 * 画面会整个翻过去；插值角度就没有这个问题。
 */
interface Key {
  s: number;
  pos: [number, number, number];
  yaw: number;
  pitch: number;
}

const KEYS: Key[] = [
  { s: 0.0, pos: [0, 0, 9.6], yaw: Math.PI, pitch: 0 },
  { s: CHAPTERS.boot.end, pos: [0, 0, 8.7], yaw: Math.PI, pitch: 0 },
  { s: CHAPTERS.rewind.end, pos: [0, 0.35, 6.0], yaw: Math.PI, pitch: -0.02 },
  { s: CHAPTERS.develop.end, pos: [0, 0, 9.2], yaw: Math.PI, pitch: 0 },
  // 这一帧必须和 orbit 公式在 yaw=0 时完全重合，两段轨道才接得上
  {
    s: CHAPTERS.arrival.end,
    pos: [0, CAMERA_Y, CAMERA_RADIUS],
    yaw: 0,
    pitch: -0.03,
  },
];

const HANDOFF = CHAPTERS.arrival.end;

const CameraRig: React.FC = () => {
  const pointer = useRef({ x: 0, y: 0, sx: 0, sy: 0 });
  const dir = useRef(new THREE.Vector3());
  const target = useRef(new THREE.Vector3());

  useFrame(({ camera, pointer: p }, dt) => {
    let pos: THREE.Vector3Tuple;
    let yaw: number;
    let pitch: number;

    if (story.scroll < HANDOFF) {
      let i = 0;
      while (i < KEYS.length - 2 && story.scroll >= KEYS[i + 1].s) i += 1;
      const a = KEYS[i];
      const b = KEYS[i + 1];
      const t = smoothstep(a.s, b.s, story.scroll);
      pos = [
        lerp(a.pos[0], b.pos[0], t),
        lerp(a.pos[1], b.pos[1], t),
        lerp(a.pos[2], b.pos[2], t),
      ];
      yaw = lerp(a.yaw, b.yaw, t);
      pitch = lerp(a.pitch, b.pitch, t);
    } else {
      // 时间已经锁死，滚轮从这里开始推的是相机
      yaw = yawAt(chapterProgress('orbit'));
      const back = smoothstep(0, 0.9, chapterProgress('restart'));

      // 半径穿过 0 变成负数 = 沿着原视线方向一路后退，朝向始终不变。
      // 用「拉远」而不是转身，收尾才是揭示，不是又一次转场。
      const radius = lerp(CAMERA_RADIUS, -7.0, back);
      pos = [
        Math.sin(yaw) * radius,
        lerp(CAMERA_Y, 5.4, back),
        Math.cos(yaw) * radius,
      ];
      pitch = lerp(-0.03, -0.3, back);
      // 没对准任何一块时报 -1：不然第 0 块会在镜头还没转到时就开始解码
      setDiscrete({ project: facingPanel(yaw) });
    }

    // 一点点鼠标视差，让静止的画面也还活着
    const ptr = pointer.current;
    ptr.sx = damp(ptr.sx, p.x, 3.5, dt);
    ptr.sy = damp(ptr.sy, p.y, 3.5, dt);

    camera.position.set(pos[0], pos[1], pos[2]);
    const finalYaw = yaw + ptr.sx * 0.045;
    const finalPitch = pitch + ptr.sy * 0.03;
    dir.current.set(
      Math.sin(finalYaw) * Math.cos(finalPitch),
      Math.sin(finalPitch),
      Math.cos(finalYaw) * Math.cos(finalPitch),
    );
    target.current
      .copy(camera.position)
      .add(dir.current.multiplyScalar(PANEL_RADIUS));
    camera.lookAt(target.current);

    // 进入雨中之后视野稍微收窄，压出一点长焦的压迫感
    const cam = camera as THREE.PerspectiveCamera;
    const fov = lerp(52, 46, clamp(chapterProgress('arrival')));
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
  });

  return null;
};

export default CameraRig;
