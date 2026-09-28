import { useEffect, useRef } from 'react';

/**
 * 每帧跑一次回调。用来把滚动进度直接写进 DOM 的 style，
 * 绕开 React —— 这类值一秒变 60 次，走 setState 会把主线程吃光。
 *
 * 所有订阅者共用一条 rAF：每个覆盖层各开一条的话，
 * 浏览器要多调度几次回调，标签页切走时也各停各的。
 */
type Task = () => void;

const tasks = new Set<Task>();
let frame = 0;

const loop = () => {
  // 标签页在后台时浏览器仍可能给低频 rAF，这里直接跳过省电
  if (!document.hidden) tasks.forEach((task) => task());
  frame = requestAnimationFrame(loop);
};

const ensureLoop = () => {
  if (!frame) frame = requestAnimationFrame(loop);
};

const stopLoop = () => {
  if (frame && tasks.size === 0) {
    cancelAnimationFrame(frame);
    frame = 0;
  }
};

const useRaf = (fn: Task) => {
  const latest = useRef(fn);
  latest.current = fn;

  useEffect(() => {
    const task = () => latest.current();
    tasks.add(task);
    ensureLoop();
    return () => {
      tasks.delete(task);
      stopLoop();
    };
  }, []);
};

export default useRaf;
