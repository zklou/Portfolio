import React from 'react';
import styles from './index.less';

interface Props {
  src: string;
  alt?: string;
  position?: string;
  className?: string;
}

// 把彩色扫描件转成"品牌色单色调 + 网点"质感：灰度 + mix-blend-mode:color 上色，
// 再叠一层细网点做 halftone 印刷感 —— 全部纯 CSS，不需要预处理图片
const DuotoneImage: React.FC<Props> = ({
  src,
  alt = '',
  position = '50% 50%',
  className,
}) => (
  <div className={[styles.wrap, className].filter(Boolean).join(' ')}>
    <img
      src={src}
      alt={alt}
      className={styles.img}
      style={{ objectPosition: position }}
    />
    <div className={styles.tint} />
    <div className={styles.halftone} />
  </div>
);

export default DuotoneImage;
