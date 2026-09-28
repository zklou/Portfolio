/**
 * 画质档位。手机和小屏跑不动桌面端的粒子量，
 * 但这条故事线不能退化成静态图——所以是减密度，不是关效果。
 */
const detect = () => {
  if (typeof window === 'undefined') return 'full';
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  // 只看宽度：桌面端把窗口压扁不该被当成手机
  const small = window.innerWidth < 760;
  const weak = (navigator.hardwareConcurrency ?? 8) <= 4;
  return coarse || small || weak ? 'lite' : 'full';
};

export const TIER = detect();

export const pick = <T>(full: T, lite: T): T => (TIER === 'full' ? full : lite);
