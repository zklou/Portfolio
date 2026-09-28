/**
 * 两套配色：日间米色橙 / 夜间黑色橙。橙色在两边都是同一个角色——强调与信号。
 *
 * 主题不能走 React Context：R3F v8 的 reconciler 不透传 context，
 * Canvas 里面拿不到。所以它挂在 state.ts 那个模块级订阅 store 上，
 * 场景组件用 useDiscrete() 拿到重渲染，用 palette() 在 useFrame 里取色。
 */
import { PINNED_THEME } from './lib/debug';

export interface Palette {
  /** 场景与页面底色 */
  bg: string;
  /** 正文 */
  ink: string;
  /** 次要信息 */
  dim: string;
  /** 橙 —— 强调、链接、终端提示符 */
  accent: string;
  /** 发丝级分割线 */
  line: string;
  /** 终端面板底 */
  panel: string;
  /** 四周压暗 */
  scrim: string;
  /** 雨的颜色 */
  rain: string;
  /** 空中雪花的颜色。亮色主题下不能用白 —— 白雪落在米色纸上等于没画 */
  snow: string;
  /** 堆积的雪。这个反过来：积雪在两套主题里都是白的 */
  snowCap: string;
  /** 积雪贴着板沿的接触阴影。没有它，白雪就是一块贴上去的色块 */
  snowShade: string;
  /** 地面网格 */
  grid: string;
  /** 粒子在亮色下要压深才看得见，暗色下相加发光 */
  additive: boolean;
}

export const THEMES: Record<'light' | 'dark', Palette> = {
  // 暖米色纸面，和夜间的近黑色形成昼夜两端
  light: {
    bg: '#f2ebdf',
    ink: '#29221b',
    dim: '#6f665c',
    accent: '#c2560c',
    line: 'rgba(41, 34, 27, 0.14)',
    panel: 'rgba(242, 235, 223, 0.86)',
    scrim: 'rgba(242, 235, 223, 0.92)',
    rain: '#4a4139',
    snow: '#7d8794',
    snowCap: '#fffdf8',
    snowShade: '#8a7f70',
    grid: '#b8ada0',
    additive: false,
  },
  dark: {
    bg: '#0c0a09',
    ink: '#f0ece6',
    dim: '#7a736b',
    accent: '#f2903a',
    line: 'rgba(240, 236, 230, 0.14)',
    panel: 'rgba(12, 10, 9, 0.78)',
    scrim: 'rgba(12, 10, 9, 0.9)',
    rain: '#e8dccb',
    snow: '#ffffff',
    snowCap: '#f4f0e9',
    snowShade: '#2a2622',
    grid: '#6b6157',
    additive: true,
  },
};

export type ThemeName = keyof typeof THEMES;

const STORAGE_KEY = 'story-theme';

export const readPreferredTheme = (): ThemeName => {
  if (typeof window === 'undefined') return 'dark';
  if (PINNED_THEME) return PINNED_THEME;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // 隐私模式下 localStorage 会直接抛，跟着系统走就行
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';
};

export const rememberTheme = (name: ThemeName) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, name);
  } catch {
    // 存不下就算了，不影响这次访问
  }
};

/** 把调色板铺成 CSS 变量，样式表那边只认 var()，配色只有这一个出处 */
export const applyThemeVars = (name: ThemeName) => {
  const p = THEMES[name];
  const root = document.documentElement;
  root.dataset.theme = name;
  root.style.setProperty('--c-bg', p.bg);
  root.style.setProperty('--c-ink', p.ink);
  root.style.setProperty('--c-dim', p.dim);
  root.style.setProperty('--c-accent', p.accent);
  root.style.setProperty('--c-line', p.line);
  root.style.setProperty('--c-panel', p.panel);
  root.style.setProperty('--c-scrim', p.scrim);
};
