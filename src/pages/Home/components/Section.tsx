import Scope from '@/components/Scope';
import useInView from '@/hooks/useInView';
import React from 'react';
import styles from './Section.less';

export type SectionTheme = 'brand' | 'light';

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
  brand: styles.themeBrand,
  light: styles.themeLight,
};

// 滚动到视口时，取景框虹膜展开露出该区块内容——把"望远镜"动效延续到正文里
// 品牌蓝/浅色两种主题交替，呼应参考站点的高对比节奏
const Section: React.FC<Props> = ({
  id,
  label,
  heading,
  theme = 'brand',
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
