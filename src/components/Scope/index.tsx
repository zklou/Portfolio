import React from 'react';
import styles from './index.less';

export interface ScopeProps {
  /** 是否展开：从取景框虹膜过渡到身后的真实内容 */
  open: boolean;
  /** 取景框直径，不传则使用响应式默认值 */
  size?: number;
  /** 取景框内循环展示的占位插画 */
  slides?: React.ReactNode[];
  /** 当前展示的插画下标 */
  activeIndex?: number;
  /** 展开后露出的正式内容 */
  children?: React.ReactNode;
  className?: string;
}

// 复刻视频中“望远镜取景框 → 虹膜展开露出真实画面”的视觉动效
const Scope: React.FC<ScopeProps> = ({
  open,
  size,
  slides = [],
  activeIndex = 0,
  children,
  className,
}) => {
  const frameStyle = size ? { width: size, height: size } : undefined;

  return (
    <div className={[styles.stage, className].filter(Boolean).join(' ')}>
      <div className={`${styles.reveal} ${open ? styles.revealOpen : ''}`}>
        {children}
      </div>
      <div
        className={`${styles.viewfinder} ${open ? styles.viewfinderOpen : ''}`}
        style={frameStyle}
      >
        <div className={styles.ring} />
        <div className={styles.slides}>
          {slides.map((slide, index) => (
            <div
              key={index}
              className={styles.slide}
              style={{ opacity: index === activeIndex ? 1 : 0 }}
            >
              {slide}
            </div>
          ))}
        </div>
        <svg
          className={styles.reticle}
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <circle cx="50" cy="50" r="45" />
          <line x1="50" y1="1" x2="50" y2="9" />
          <line x1="50" y1="91" x2="50" y2="99" />
          <line x1="1" y1="50" x2="9" y2="50" />
          <line x1="91" y1="50" x2="99" y2="50" />
        </svg>
        <div className={styles.chroma} />
        <div className={styles.grain} />
      </div>
    </div>
  );
};

export default Scope;
