import bird from '@/assets/scope/bird.jpg';
import DuotoneImage from '@/components/DuotoneImage';
import {
  CONTACT_EMAIL,
  SITE_NAME,
  SITE_TAGLINE,
  SOCIAL_LINKS,
} from '@/constants';
import React from 'react';
import styles from './HeroContent.less';

interface Props {
  visible: boolean;
}

const github = SOCIAL_LINKS.find((link) => link.label === 'GitHub');

// 望远镜展开后露出的真实场景：品牌蓝底 + 巨字标题 + 大幅单色调版画，
// 呼应参考站点"大字左 + 版画右"的两栏构图
const HeroContent: React.FC<Props> = ({ visible }) => (
  <div className={styles.hero}>
    <div className={`${styles.grid} ${visible ? styles.gridVisible : ''}`}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>PORTFOLIO</p>
        <h1 className={styles.title}>{SITE_NAME}</h1>
        <p className={styles.tagline}>{SITE_TAGLINE}</p>
        <div className={styles.actions}>
          <a className={styles.button} href={`mailto:${CONTACT_EMAIL}`}>
            Get in touch
          </a>
          {github && (
            <a
              className={styles.ghost}
              href={github.url}
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
          )}
        </div>
      </div>
      <div className={styles.plate}>
        <DuotoneImage src={bird} position="55% 55%" />
      </div>
    </div>
    <div
      className={`${styles.scrollCue} ${
        visible ? styles.scrollCueVisible : ''
      }`}
    >
      SCROLL ↓
    </div>
  </div>
);

export default HeroContent;
