import { ABOUT_TEXT } from '@/constants';
import React from 'react';
import styles from './About.less';
import Section from './Section';

const About: React.FC = () => (
  <Section label="ABOUT · 关于我">
    <p className={styles.text}>{ABOUT_TEXT}</p>
  </Section>
);

export default About;
