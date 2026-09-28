import { BOOT_SCRIPT } from '../config';
import { palette } from '../state';

export const TERMINAL_W = 1280;
export const TERMINAL_H = 720;

const FONT_SIZE = 21;
const LINE_H = 30;
const FONT = `${FONT_SIZE}px ui-monospace, SFMono-Regular, Menlo, monospace`;

const LINES = BOOT_SCRIPT.split('\n');
export const TOTAL_CHARS = LINES.reduce((n, l) => n + l.length + 1, 0);

/** 命令和滚动提示用橙色，诗句所在的数组用正文色。 */
const colorFor = (line: string) => {
  const p = palette();
  const t = line.trimStart();
  if (t.startsWith('$')) return p.accent;
  if (t.startsWith('[')) return p.accent;
  if (t.startsWith('>')) return p.ink;
  return p.dim;
};

/**
 * 文本块在画布里居中。等宽字体的实际字宽跟平台有关，所以量一次再算原点。
 */
let origin: { x: number; y: number } | null = null;

const measureOrigin = (ctx: CanvasRenderingContext2D) => {
  if (origin) return origin;
  ctx.font = FONT;
  const w = LINES.reduce(
    (max, l) => Math.max(max, ctx.measureText(l).width),
    0,
  );
  origin = {
    x: Math.round((TERMINAL_W - w) / 2),
    y: Math.round((TERMINAL_H - LINES.length * LINE_H) / 2),
  };
  return origin;
};

export const createTerminalCanvas = () => {
  const canvas = document.createElement('canvas');
  canvas.width = TERMINAL_W;
  canvas.height = TERMINAL_H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.font = FONT;
  ctx.textBaseline = 'top';
  measureOrigin(ctx);
  return { canvas, ctx };
};

/**
 * 把前 revealed 个字符画出来。整块文本始终画在同一张 canvas 上，
 * 这张 canvas 既是 boot 章展示的贴图，也是 rewind 章粒子的采样源——
 * 所以文字是「原地」碎掉的，不是换了个东西再碎。
 */
export const drawTerminal = (
  ctx: CanvasRenderingContext2D,
  revealed: number,
  cursorOn: boolean,
) => {
  ctx.clearRect(0, 0, TERMINAL_W, TERMINAL_H);
  ctx.font = FONT;
  ctx.textBaseline = 'top';

  const { x: padX, y: padY } = measureOrigin(ctx);
  let budget = revealed;
  let y = padY;
  let cursorX = padX;
  let cursorY = padY;

  for (const line of LINES) {
    if (budget <= 0) break;
    const shown = line.slice(0, budget);
    ctx.fillStyle = colorFor(line);
    ctx.fillText(shown, padX, y);
    cursorX = padX + ctx.measureText(shown).width;
    cursorY = y;
    budget -= line.length + 1;
    y += LINE_H;
  }

  if (cursorOn) {
    ctx.fillStyle = palette().accent;
    ctx.fillRect(cursorX + 2, cursorY + 3, FONT_SIZE * 0.55, FONT_SIZE);
  }
};
