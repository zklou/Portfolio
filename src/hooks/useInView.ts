import { useEffect, useRef, useState } from 'react';

// 元素首次进入视口后返回 true 并停止观察，用于滚动触发的一次性展开动效
const useInView = <T extends HTMLElement>(threshold = 0.35) => {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
};

export default useInView;
