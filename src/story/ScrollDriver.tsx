import Lenis from 'lenis';
import { useEffect, useState } from 'react';
import { CHAPTERS } from './config';
import { PINNED_SCROLL } from './lib/debug';
import { clamp, damp, lerp } from './lib/math';
import { ORBIT_EXIT, orbitStepTarget, snapTarget } from './lib/snap';
import {
  chapterProgress,
  discrete,
  DiscreteState,
  resolveChapter,
  setDiscrete,
  story,
  subscribeDiscrete,
} from './state';

/** 低于这个速度就算停下了，可以开始考虑吸附 */
const IDLE_VELOCITY = 0.015;
/** 停稳多久才吸，太短会在用户还没松手时就抢方向盘 */
const IDLE_DELAY = 0.13;
const SNAP_DURATION = 0.9;

/**
 * 水结成雪的速度。给得慢是故意的——时间刚停住时还是雨，
 * 停够两三秒才看见它结晶。「冻住一会儿之后开始下雪」就是这个滞后。
 */
const FREEZE_TO_SNOW = 0.42;
/**
 * 雪刚成形时的下落速率，相对雨速。真实的雪比雨慢一个量级不止，
 * 何况这里的时间已经是 0 —— 给到雨速的百分之二才对得上。
 */
const SNOW_FALL = 0.022;
/** 落定速度：雪一边飘一边减速，十几秒后彻底停住 */
const SETTLE_RATE = 0.16;
/** 积雪堆起来有多慢，化掉有多快 */
const DRIFT_GAIN = 0.11;
const DRIFT_MELT = 0.3;
/** 触控板一次滑动会发出一串 wheel 事件；尾声安静下来才允许下一次。 */
const WHEEL_QUIET_MS = 280;
const TOUCH_TRIGGER_PX = 36;

/** 滚多快算「猛滚」。越小越容易冻住时间 */
const VELOCITY_FULL = 26;
/** 冻结来得快、化开得慢——像踩了一脚急刹 */
const FREEZE_ATTACK = 26;
const FREEZE_RELEASE = 2.6;

/**
 * 整站唯一的驱动源：把滚动换算成全局进度，并决定此刻滚轮到底在推动什么。
 *
 *   rain 章  —— 滚动 = 刹车。停手，时间就恢复流动。
 *   orbit 章 —— 时间被永久锁死，一次滑动把相机送到下一张展板。
 *
 * 这两章之间 freezeLock 从 0 平滑推到 1，于是「滚动会让时间停住」这条规则
 * 先被演示一次，再被彻底兑现。
 */
const useScrollDriver = () => {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // 整条体验都建立在运动上，没法真的「关掉动效」；
    // 至少把惯性滚动去掉，滚轮一停画面就停，不再自己往前滑。
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let orbitAnimating = false;
    let orbitWatchdog: ReturnType<typeof setTimeout> | null = null;
    let wheelGestureUsed = false;
    let wheelQuiet: ReturnType<typeof setTimeout> | null = null;
    let touchTravel = 0;
    let touchGestureUsed = false;

    const keepWheelGesture = () => {
      if (wheelQuiet) clearTimeout(wheelQuiet);
      wheelQuiet = setTimeout(() => {
        wheelGestureUsed = false;
        wheelQuiet = null;
      }, WHEEL_QUIET_MS);
    };

    const instance = new Lenis({
      lerp: reduced ? 1 : 0.085,
      wheelMultiplier: 0.9,
      syncTouch: true,
      virtualScroll: ({ deltaX, deltaY, event }) => {
        if (PINNED_SCROLL !== null || event.ctrlKey) return true;
        if (event.type === 'touchend' && touchGestureUsed) {
          touchTravel = 0;
          touchGestureUsed = false;
          if (event.cancelable) event.preventDefault();
          return false;
        }
        if (
          event
            .composedPath()
            .some(
              (node) =>
                node instanceof HTMLElement &&
                node.hasAttribute('data-lenis-prevent'),
            )
        ) {
          return true;
        }

        // 最后一张离开 orbit 后，惯性尾声仍属于刚才那次手势。
        if (event.type === 'wheel' && (wheelGestureUsed || orbitAnimating)) {
          keepWheelGesture();
          if (event.cancelable) event.preventDefault();
          return false;
        }
        if (event.type === 'touchmove' && touchGestureUsed) {
          if (event.cancelable) event.preventDefault();
          return false;
        }

        const scroll = clamp(
          instance.targetScroll / Math.max(1, instance.limit),
        );
        const next = scroll + deltaY / Math.max(1, instance.limit);
        const inOrbit =
          scroll >= CHAPTERS.orbit.start - 0.001 &&
          scroll <= CHAPTERS.orbit.end + 0.001;
        const enteringOrbit =
          scroll < CHAPTERS.orbit.start - 0.001 && next >= CHAPTERS.orbit.start;
        const backingFromExit =
          Math.abs(scroll - ORBIT_EXIT) < 0.003 && deltaY < 0;

        // 展板以外仍交给 Lenis 连续滚动。大幅滑动碰到展板入口时先停在入口。
        if (!inOrbit && !enteringOrbit && !backingFromExit) return true;
        if (Math.abs(deltaX) > Math.abs(deltaY)) return true;

        const isTouch = event.type.startsWith('touch');
        if (isTouch && event.type === 'touchstart') {
          touchTravel = 0;
          touchGestureUsed = false;
          return false;
        }
        if (isTouch && event.type === 'touchend') {
          touchTravel = 0;
          touchGestureUsed = false;
          return false;
        }
        if (deltaY === 0) return false;

        const destination = enteringOrbit
          ? CHAPTERS.orbit.start
          : orbitStepTarget(scroll, Math.sign(deltaY));
        if (destination === null) return true;
        if (event.cancelable) event.preventDefault();

        if (isTouch) {
          touchTravel += deltaY;
          if (touchGestureUsed || Math.abs(touchTravel) < TOUCH_TRIGGER_PX) {
            return false;
          }
          touchGestureUsed = true;
        } else {
          keepWheelGesture();
          wheelGestureUsed = true;
        }

        if (orbitAnimating) return false;
        orbitAnimating = true;
        if (orbitWatchdog) clearTimeout(orbitWatchdog);
        orbitWatchdog = setTimeout(() => {
          orbitAnimating = false;
          orbitWatchdog = null;
        }, 3600);
        instance.scrollTo(destination * instance.limit, {
          duration: reduced
            ? 0.2
            : Math.abs(destination - scroll) > 0.1
            ? 2.9
            : 2.5,
          // 两端都收得住的三次缓动。相机是走过去的，不是弹过去的
          easing: (t: number) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
          onComplete: () => {
            orbitAnimating = false;
            if (orbitWatchdog) clearTimeout(orbitWatchdog);
            orbitWatchdog = null;
          },
        });
        return false;
      },
    });

    instance.stop(); // 开场终端播完之前不许滚

    let raf = 0;
    let last = performance.now();
    let freeze = 0;
    let idleFor = 0;
    let settled = false;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      instance.raf(now);

      if (PINNED_SCROLL === null) {
        story.scroll = clamp(instance.progress || 0);
        story.velocity = clamp(Math.abs(instance.velocity) / VELOCITY_FULL);
      } else {
        story.scroll = PINNED_SCROLL;
        story.velocity = 0;
      }

      // 滚动本身造成的瞬时冻结
      const target = story.velocity;
      freeze = damp(
        freeze,
        target,
        target > freeze ? FREEZE_ATTACK : FREEZE_RELEASE,
        dt,
      );

      // 时间锁在 rain 章合上，穿过整个 orbit，再在 restart 章打开。
      // 「时间停住 → 我们走过去 → 时间重新开始」这条故事线就是这一个变量。
      const lock = chapterProgress('rain') * (1 - chapterProgress('restart'));
      story.timeScale = (1 - lock) * (1 - freeze);
      story.clock += dt * story.timeScale;

      // 雨和雪不是两种东西，是同一种水在两个时间速度下的样子。
      // 转化刻意滞后：时间停住的那一刻还是雨，停久了才结晶。
      story.snow = damp(story.snow, 1 - story.timeScale, FREEZE_TO_SNOW, dt);
      // 整个天气是四拍：雨变雪 → 雪飘落 → 减速 → 停滞。
      // 最后一拍是停住，不是永远飘着——所以速率会衰减到零。
      const falling = story.snow > 0.5;
      story.settle = damp(
        story.settle,
        falling ? 1 : 0,
        falling ? SETTLE_RATE : 2.5,
        dt,
      );
      // 相位只有一条，速率在「雨速」和「雪速」之间插值，所以不会跳帧
      const snowRate = SNOW_FALL * (1 - story.settle);
      story.fall += dt * lerp(story.timeScale, snowRate, story.snow);
      // 雪落得越慢堆得越慢；一滚动雨又把积雪冲掉
      story.drift = clamp(
        story.drift +
          dt *
            (story.snow * (1 - story.settle * 0.7) * DRIFT_GAIN -
              (1 - story.snow) * DRIFT_MELT),
      );

      // 停稳之后把位置圆到最近的画面上；正在吸附时 velocity 不为零，
      // 所以这里天然不会自己跟自己打架
      if (PINNED_SCROLL === null && story.booted && !orbitAnimating) {
        if (story.velocity > IDLE_VELOCITY) {
          idleFor = 0;
          settled = false;
        } else if (!settled) {
          idleFor += dt;
          if (idleFor > IDLE_DELAY) {
            settled = true;
            const target = snapTarget(story.scroll);
            if (target !== null) {
              instance.scrollTo(target * instance.limit, {
                duration: reduced ? 0.2 : SNAP_DURATION,
                easing: (t: number) => 1 - Math.pow(1 - t, 3),
              });
            }
          }
        }
      }

      setDiscrete({ chapter: resolveChapter() });
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    setLenis(instance);

    return () => {
      cancelAnimationFrame(raf);
      if (wheelQuiet) clearTimeout(wheelQuiet);
      if (orbitWatchdog) clearTimeout(orbitWatchdog);
      instance.destroy();
    };
  }, []);

  return lenis;
};

/** 订阅离散状态（当前章节 / 当前项目），只在真的变了时触发重渲染 */
export const useDiscrete = (): DiscreteState => {
  const [state, setState] = useState<DiscreteState>({ ...discrete });
  useEffect(() => {
    const off = subscribeDiscrete(setState);
    return () => {
      off();
    };
  }, []);
  return state;
};

export default useScrollDriver;
