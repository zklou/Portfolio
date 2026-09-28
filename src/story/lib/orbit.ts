import { PANELS } from '../config';
import { clamp, lerp, smoothstep } from './math';

/** 相机绕行的半径。它就站在雨幕中心附近，往外看 */
export const CAMERA_RADIUS = 3.1;
export const CAMERA_Y = 1.35;
/** 作品展板所在的半径 */
export const PANEL_RADIUS = 13.5;
export const PANEL_Y = 1.15;

/** 展板均匀摆一圈，但留出第一格当「起手的空位」 */
export const PANEL_ANGLES = PANELS.map(
  (_, i) => ((i + 1) / (PANELS.length + 1)) * Math.PI * 2,
);

const STOPS = [0, ...PANEL_ANGLES];
const SEGMENTS = STOPS.length - 1;
/** 每段行程走完前 65%，剩下 35% 停在展板前 */
const TRAVEL = 0.65;

/** 把线性滚动掰成「转过去 → 停一下 → 再转」的节奏 */
export const yawAt = (p: number) => {
  const scaled = clamp(p) * SEGMENTS;
  const i = Math.min(SEGMENTS - 1, Math.floor(scaled));
  return lerp(STOPS[i], STOPS[i + 1], smoothstep(0, TRAVEL, scaled - i));
};

/** 当前正对着第几块展板；没对准任何一块时返回 -1 */
export const facingPanel = (yaw: number) => {
  let best = -1;
  let bestDelta = 0.42;
  PANEL_ANGLES.forEach((a, i) => {
    const d = Math.abs(a - yaw);
    if (d < bestDelta) {
      bestDelta = d;
      best = i;
    }
  });
  return best;
};

/** 展板正对镜头的程度 0→1，用来给对应的文案做淡入 */
export const panelAlignment = (index: number, yaw: number) =>
  1 - smoothstep(0.12, 0.55, Math.abs(PANEL_ANGLES[index] - yaw));
