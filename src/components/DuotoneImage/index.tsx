import React from 'react';
import styles from './index.less';

interface Props {
  src: string;
  alt?: string;
  position?: string;
  className?: string;
  /** true 时套用品牌色单色调+网点，默认走做旧胶片的自然色调 */
  duotone?: boolean;
}

const DuotoneImage: React.FC<Props> = ({
  src,
  alt = '',
  position = '50% 50%',
  className,
  duotone = false,
}) => (
  <div className={[styles.wrap, className].filter(Boolean).join(' ')}>
    <img
      src={src}
      alt={alt}
      className={`${styles.img} ${
        duotone ? styles.imgDuotone : styles.imgNatural
      }`}
      style={{ objectPosition: position }}
    />
    {duotone && (
      <>
        <div className={styles.tint} />
        <div className={styles.halftone} />
      </>
    )}
  </div>
);

export default DuotoneImage;
