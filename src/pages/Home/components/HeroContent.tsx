import { SITE_NAME, SITE_TAGLINE } from '@/constants';
import React from 'react';
import styles from './HeroContent.less';

interface Props {
  visible: boolean;
}

// 望远镜展开后露出的真实“天空”场景：渐变天色 + 云 + 枝头小鸟 + 标题
const HeroContent: React.FC<Props> = ({ visible }) => (
  <div className={styles.sky}>
    <div className={styles.cloudA} />
    <div className={styles.cloudB} />
    <svg
      className={styles.branch}
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMax slice"
    >
      <path
        d="M0 40 C 90 60, 160 90, 220 130 C 270 160, 330 170, 400 150"
        fill="none"
        stroke="#5b4a3a"
        strokeWidth="2"
      />
      <path
        d="M150 78 C 170 55, 190 45, 210 30"
        fill="none"
        stroke="#5b4a3a"
        strokeWidth="1.4"
      />
      <path
        d="M260 145 C 280 120, 300 108, 330 100"
        fill="none"
        stroke="#5b4a3a"
        strokeWidth="1.4"
      />
      <ellipse cx="230" cy="122" rx="9" ry="6.5" fill="#3c3a33" />
      <path d="M221 122 q 9 -6 18 0" fill="#c8d24a" opacity="0.85" />
    </svg>
    <div className={`${styles.copy} ${visible ? styles.copyVisible : ''}`}>
      <p className={styles.eyebrow}>PORTFOLIO</p>
      <h1 className={styles.title}>{SITE_NAME}</h1>
      <p className={styles.tagline}>{SITE_TAGLINE}</p>
    </div>
    <div
      className={`${styles.scrollCue} ${
        visible ? styles.scrollCueVisible : ''
      }`}
    >
      向下滚动
    </div>
  </div>
);

export default HeroContent;
