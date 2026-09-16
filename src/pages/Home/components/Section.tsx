import Scope from '@/components/Scope';
import useInView from '@/hooks/useInView';
import React from 'react';
import styles from './Section.less';

export type SectionTheme = 'paper' | 'ink' | 'dusk' | 'sky';

interface Props {
  id?: string;
  label: string;
  heading: string;
  theme?: SectionTheme;
  wide?: boolean;
  tall?: boolean;
  children: React.ReactNode | ((active: boolean) => React.ReactNode);
}

const themeClassMap: Record<SectionTheme, string> = {
  paper: styles.themePaper,
  ink: styles.themeInk,
  dusk: styles.themeDusk,
  sky: styles.themeSky,
};

// 滚动到视口时，取景框虹膜展开露出该区块内容——把"望远镜"动效延续到正文里
// 每个区块换一种主题色，呼应视频里从暗室到黄昏天空的色彩旅程
const Section: React.FC<Props> = ({
  id,
  label,
  heading,
  theme = 'paper',
  wide,
  tall,
  children,
}) => {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <section
      id={id}
      ref={ref}
      className={`${styles.section} ${themeClassMap[theme]} ${
        tall ? styles.sectionTall : ''
      }`}
    >
      <Scope open={inView} size={180}>
        <div className={`${styles.panel} ${wide ? styles.panelWide : ''}`}>
          <span className={styles.label}>{label}</span>
          <h2 className={styles.heading}>{heading}</h2>
          {typeof children === 'function' ? children(inView) : children}
        </div>
      </Scope>
    </section>
  );
};

export default Section;
