import bird from '@/assets/scope/bird.jpg';
import digitalis from '@/assets/scope/digitalis.jpg';
import insect from '@/assets/scope/insect.jpg';
import rose from '@/assets/scope/rose.jpg';
import React from 'react';
import styles from './illustrations.less';

// 取景框里循环展示的插画：公有领域古典博物画扫描件，替换成别的图时
// 换掉对应 src 并调整 objectPosition 即可
interface PlateProps {
  src: string;
  position: string;
  caption: string;
}

const Plate: React.FC<PlateProps> = ({ src, position, caption }) => (
  <div className={styles.slideBase}>
    <img
      src={src}
      alt=""
      className={styles.art}
      style={{ objectPosition: position }}
    />
    <span className={styles.caption}>{caption}</span>
  </div>
);

export const DigitalisSlide: React.FC = () => (
  <Plate src={digitalis} position="50% 45%" caption="Digitalis purpurea" />
);

export const RoseSlide: React.FC = () => (
  <Plate src={rose} position="50% 42%" caption="Rosa gallica" />
);

export const InsectSlide: React.FC = () => (
  <Plate
    src={insect}
    position="50% 40%"
    caption="Metamorphosis Insectorum, 1705"
  />
);

export const BirdSlide: React.FC = () => (
  <Plate src={bird} position="55% 62%" caption="Hirundo fulva" />
);
