import { CHAPTERS, PANELS } from '../config';

/**
 * 吸附点。滚动停下来时如果落在某个区间的前 20% 或后 20%，就圆到那一头，
 * 免得停在两个画面中间那种「哪边都不是」的位置。
 *
 * 点位不只是章节边界：orbit 章里三块展板各有一段停靠，
 * 停在两块展板之间同样是「停在中间」，所以它们也算点位。
 */
const orbitStops = () => {
  const { start, end } = CHAPTERS.orbit;
  const span = end - start;
  const segments = PANELS.length;
  // yawAt 把 orbit 分成 PANELS.length 段；每段后 35% 是停靠区，取其中点。
  return PANELS.map((_, i) => start + ((i + 0.825) / segments) * span);
};

/** 展板真正停稳的位置，供吸附和逐张翻阅共用。 */
export const ORBIT_STOPS = orbitStops();

/** 离开展板后直接把结尾终端带入视野，免得最后一次滚动只移动一小段。 */
export const ORBIT_EXIT =
  CHAPTERS.restart.start +
  (CHAPTERS.restart.end - CHAPTERS.restart.start) * 0.75;

const ORBIT_ACTIONS = [CHAPTERS.orbit.start, ...ORBIT_STOPS, ORBIT_EXIT];

/** 只取当前方向的下一个停靠点，一次手势不会跨过两张展板。 */
export const orbitStepTarget = (scroll: number, direction: number) => {
  const epsilon = 0.002;
  if (direction > 0) {
    return ORBIT_ACTIONS.find((stop) => stop > scroll + epsilon) ?? null;
  }
  if (direction < 0) {
    return (
      [...ORBIT_ACTIONS].reverse().find((stop) => stop < scroll - epsilon) ??
      null
    );
  }
  return null;
};

export const SNAP_POINTS = Array.from(
  new Set([
    ...Object.values(CHAPTERS).flatMap((c) => [c.start, c.end]),
    ...ORBIT_STOPS,
  ]),
).sort((a, b) => a - b);

/** 落在区间边缘多近才吸过去 */
const EDGE = 0.2;

/**
 * 给定当前进度，返回该吸过去的位置；已经在舒服的位置上就返回 null。
 */
export const snapTarget = (scroll: number): number | null => {
  if (
    scroll <= SNAP_POINTS[0] ||
    scroll >= SNAP_POINTS[SNAP_POINTS.length - 1]
  ) {
    return null;
  }

  let i = 0;
  while (i < SNAP_POINTS.length - 2 && scroll >= SNAP_POINTS[i + 1]) i += 1;
  const a = SNAP_POINTS[i];
  const b = SNAP_POINTS[i + 1];
  if (b - a < 1e-6) return null;

  const p = (scroll - a) / (b - a);
  if (p < EDGE) return a;
  if (p > 1 - EDGE) return b;
  return null;
};
