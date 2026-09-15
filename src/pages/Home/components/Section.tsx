import Scope from '@/components/Scope';
import useInView from '@/hooks/useInView';
import React from 'react';
import styles from './Section.less';

interface Props {
  label: string;
  wide?: boolean;
  /** 内容较多（如多张卡片纵向堆叠）时给区块更高的高度，避免内容被裁切 */
  tall?: boolean;
  children: React.ReactNode;
}

// 滚动到视口时，取景框虹膜展开露出该区块内容——把“望远镜”动效延续到正文里
const Section: React.FC<Props> = ({ label, wide, tall, children }) => {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <section
      ref={ref}
      className={`${styles.section} ${tall ? styles.sectionTall : ''}`}
    >
      <Scope open={inView} size={160}>
        <div className={`${styles.panel} ${wide ? styles.panelWide : ''}`}>
          <span className={styles.label}>{label}</span>
          {children}
        </div>
      </Scope>
    </section>
  );
};

export default Section;
