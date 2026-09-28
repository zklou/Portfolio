import { CHAPTERS, ChapterId } from './config';
import { Palette, THEMES, ThemeName } from './theme';

/**
 * 逐帧变化的量全部放在这个可变对象里，绕开 React 的 re-render。
 * R3F 的 useFrame 直接读它；只有「当前是第几章」「当前是哪个项目」这类
 * 离散状态才通过订阅推给 React。
 */
export const story = {
  /** 全局滚动进度 0→1（经过 Lenis 平滑） */
  scroll: 0,
  /** 归一化滚动速度，0=静止，1=猛滚。雨的冻结就是它驱动的 */
  velocity: 0,
  /** 叙事时钟。它不等于真实时间——被冻结时它就不走 */
  clock: 0,
  /** 时间流速 0→1。1=正常走，0=完全静止 */
  timeScale: 1,
  /**
   * 0 = 雨，1 = 雪。它追着 1 - timeScale 走，但故意慢：
   * 时间刚停住的那一刻还是雨，停够久了水才结成雪。
   */
  snow: 0,
  /**
   * 下落相位。雨按 timeScale 走，雪另有一口慢钟——
   * 所以时间「冻住」之后雪仍在飘，只是飘得极慢。
   */
  fall: 0,
  /**
   * 落定进度 0→1。雪不是永远飘：结成之后一边落一边减速，最后彻底停住。
   * 时间恢复流动时它迅速归零。
   */
  settle: 0,
  /** 积雪厚度 0→1。雪天慢慢堆，一下雨很快冲掉 */
  drift: 0,
  /** 雨幕当前的可见度 0→1。文字的侵蚀强度跟着它走 */
  rainVisible: 0,
  /** 开场终端是否已播完 */
  booted: false,
  /** 视口是否已经准备好（贴图采样完成） */
  ready: false,
};

export type DiscreteState = {
  chapter: ChapterId;
  project: number;
  booted: boolean;
  /** 作品图已经采样成粒子目标 —— 没就绪就放行滚动，粒子会飞向一堆零 */
  ready: boolean;
  theme: ThemeName;
};

const listeners = new Set<(s: DiscreteState) => void>();

export const discrete: DiscreteState = {
  chapter: 'boot',
  project: 0,
  booted: false,
  ready: false,
  theme: 'dark',
};

/** 只在值真的变了的时候才通知 React，避免每帧 setState */
export const setDiscrete = (patch: Partial<DiscreteState>) => {
  let changed = false;
  (Object.keys(patch) as (keyof DiscreteState)[]).forEach((key) => {
    if (discrete[key] !== patch[key]) {
      (discrete as any)[key] = patch[key];
      changed = true;
    }
  });
  if (changed) listeners.forEach((fn) => fn({ ...discrete }));
};

export const subscribeDiscrete = (fn: (s: DiscreteState) => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

/** 把全局进度换算成某一章的局部进度，超出范围就钳在 0 或 1 */
export const chapterProgress = (id: ChapterId, scroll = story.scroll) => {
  const { start, end } = CHAPTERS[id];
  return Math.min(1, Math.max(0, (scroll - start) / (end - start)));
};

export const resolveChapter = (scroll = story.scroll): ChapterId => {
  const ids = Object.keys(CHAPTERS) as ChapterId[];
  for (let i = ids.length - 1; i >= 0; i -= 1) {
    if (scroll >= CHAPTERS[ids[i]].start) return ids[i];
  }
  return 'boot';
};

/** 当前调色板。useFrame 里每帧取色用这个，不必走 React */
export const palette = (): Palette => THEMES[discrete.theme];
