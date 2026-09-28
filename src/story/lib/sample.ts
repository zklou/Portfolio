import { mulberry32 } from './math';

export interface Sampled {
  positions: Float32Array;
  colors: Float32Array;
}

export interface FitBox {
  w: number;
  h: number;
}

/**
 * 从一张 canvas 里抽出 count 个点，等比缩放后放进以原点为中心的 fit 框里。
 * 必须等比——素材横竖不一，按宽度铺会让竖图顶穿画面。
 * 传 alphaMin 时只取不透明的像素（抽文字笔画），不传就均匀铺满（抽照片）。
 */
export const samplePixels = (
  source: HTMLCanvasElement,
  count: number,
  fit: FitBox,
  alphaMin?: number,
  seed = 1,
  /** 只取亮度低于此值的像素。线描图版要采的是墨，不是纸 */
  inkMax?: number,
): Sampled => {
  const { width: w, height: h } = source;
  const scale = Math.min(fit.w / w, fit.h / h);
  const planeW = w * scale;
  const planeH = h * scale;
  const ctx = source.getContext('2d', { willReadFrequently: true })!;
  const { data } = ctx.getImageData(0, 0, w, h);
  const rand = mulberry32(seed);

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  // 文字笔画只占画布的百分之几，随机撒点会大量落空，先把有墨的像素挑出来
  let pool: Int32Array | null = null;
  let poolSize = 0;
  if (alphaMin !== undefined || inkMax !== undefined) {
    const threshold = (alphaMin ?? 0) * 255;
    pool = new Int32Array(w * h);
    for (let i = 0; i < w * h; i += 1) {
      const o = i * 4;
      if (data[o + 3] <= threshold) continue;
      if (inkMax !== undefined) {
        const lum =
          (data[o] * 0.299 + data[o + 1] * 0.587 + data[o + 2] * 0.114) / 255;
        // 太亮的是纸，采进来只会得到一块发光的矩形
        if (lum > inkMax) continue;
      }
      pool[poolSize] = i;
      poolSize += 1;
    }
  }

  for (let i = 0; i < count; i += 1) {
    let px: number;
    let py: number;
    if (pool) {
      const idx = pool[poolSize ? Math.floor(rand() * poolSize) : 0];
      px = idx % w;
      py = Math.floor(idx / w);
    } else {
      px = Math.floor(rand() * w);
      py = Math.floor(rand() * h);
    }

    const o = (py * w + px) * 4;
    // 同一个像素可能被抽中多次，加半像素抖动让重复点不会精确叠在一起
    const jx = (px + rand()) / w - 0.5;
    const jy = 0.5 - (py + rand()) / h;

    positions[i * 3] = jx * planeW;
    positions[i * 3 + 1] = jy * planeH;
    positions[i * 3 + 2] = 0;

    colors[i * 3] = data[o] / 255;
    colors[i * 3 + 1] = data[o + 1] / 255;
    colors[i * 3 + 2] = data[o + 2] / 255;
  }

  return { positions, colors };
};

export const imageToCanvas = (img: HTMLImageElement, maxW = 720) => {
  const scale = Math.min(1, maxW / img.naturalWidth);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
};

export const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
