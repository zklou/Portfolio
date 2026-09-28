/**
 * 开发用的定格参数：?t=0.63 会把整条时间轴钉在 63% 上，跳过开场直接看那一章。
 * 调某一章的动画时不用每次从头滚一遍。
 */
const read = () => {
  if (typeof window === 'undefined') return null;
  const raw = new URLSearchParams(window.location.search).get('t');
  if (raw === null || raw === '') return null;
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : null;
};

export const PINNED_SCROLL = read();

/** ?theme=light|dark 强制配色，方便对着截图调两套主题 */
export const PINNED_THEME = (() => {
  if (typeof window === 'undefined') return null;
  const raw = new URLSearchParams(window.location.search).get('theme');
  return raw === 'light' || raw === 'dark' ? raw : null;
})();

/**
 * ?nogl=1 跳过 WebGL 画布。覆盖层是纯 DOM，调文字、排版、发丝这些东西时
 * 不必等整个场景渲染——软件渲染下那要好几分钟。
 */
export const SKIP_GL =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('nogl') === '1';
