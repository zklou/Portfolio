import React from 'react';
import styles from './illustrations.less';

// 以下均为代码生成的占位插画，替换成你自己的图片/插画时直接换掉对应组件即可

export const SpecimenSlide: React.FC = () => (
  <div className={`${styles.slideBase} ${styles.paper}`}>
    <svg viewBox="0 0 200 200" className={styles.art}>
      <path
        d="M100 40 C 108 70, 130 90, 160 100 C 130 110, 108 130, 100 160 C 92 130, 70 110, 40 100 C 70 90, 92 70, 100 40 Z"
        fill="none"
        stroke="#8a6d3b"
        strokeWidth="1.2"
      />
      <line
        x1="60"
        y1="100"
        x2="140"
        y2="100"
        stroke="#2b241a"
        strokeWidth="1"
      />
      <line
        x1="100"
        y1="60"
        x2="100"
        y2="140"
        stroke="#2b241a"
        strokeWidth="1"
        opacity="0.5"
      />
    </svg>
    <span className={styles.caption}>STUDY NO. 01</span>
  </div>
);

export const BotanicalSlide: React.FC = () => (
  <div className={`${styles.slideBase} ${styles.paper}`}>
    <svg viewBox="0 0 200 200" className={styles.art}>
      <path
        d="M100 170 C 96 120, 104 90, 100 40"
        fill="none"
        stroke="#4c6b4a"
        strokeWidth="1.4"
      />
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={100 + (i - 1) * 22}
          cy={70 + i * 14}
          r="9"
          fill="none"
          stroke="#a45a63"
          strokeWidth="1"
        />
      ))}
      <path
        d="M60 150 Q 100 130 140 150"
        fill="none"
        stroke="#8a8f5c"
        strokeWidth="1"
      />
    </svg>
    <span className={styles.caption}>SPECIMEN A</span>
  </div>
);

export const MedallionSlide: React.FC = () => (
  <div className={`${styles.slideBase} ${styles.paperDark}`}>
    <svg viewBox="0 0 200 200" className={styles.art}>
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const x1 = 100 + Math.cos(angle) * 40;
        const y1 = 100 + Math.sin(angle) * 40;
        const x2 = 100 + Math.cos(angle) * 88;
        const y2 = 100 + Math.sin(angle) * 88;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#d8b25c"
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      })}
      <circle
        cx="100"
        cy="100"
        r="38"
        fill="#efe6d3"
        stroke="#8a6d3b"
        strokeWidth="1"
      />
    </svg>
    <span className={styles.captionLight}>NO. 03</span>
  </div>
);

export const ContourSlide: React.FC = () => (
  <div className={`${styles.slideBase} ${styles.paper}`}>
    <svg viewBox="0 0 200 200" className={styles.art}>
      {[26, 44, 62, 80].map((r, i) => (
        <path
          key={r}
          d={`M ${100 - r} 100 C ${100 - r} ${100 - r * 0.6}, ${
            100 - r * 0.4
          } ${100 - r}, 100 ${100 - r} C ${100 + r * 0.5} ${100 - r}, ${
            100 + r
          } ${100 - r * 0.5}, ${100 + r} 100 C ${100 + r} ${100 + r * 0.55}, ${
            100 + r * 0.45
          } ${100 + r}, 100 ${100 + r} C ${100 - r * 0.5} ${100 + r}, ${
            100 - r
          } ${100 + r * 0.5}, ${100 - r} 100 Z`}
          fill="none"
          stroke={i % 2 === 0 ? '#6b7f97' : '#a45a63'}
          strokeWidth="1"
          opacity={0.8 - i * 0.12}
        />
      ))}
    </svg>
    <span className={styles.caption}>NO. 04</span>
  </div>
);
