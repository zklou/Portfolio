import { ABOUT_TEXT } from '@/constants';
import React from 'react';
import styles from './About.less';
import Section from './Section';

const About: React.FC = () => (
  <Section
    id="about"
    label="01 · ABOUT · 关于我"
    heading="About Me"
    theme="ink"
  >
    <p className={styles.text}>{ABOUT_TEXT}</p>
  </Section>
);

export default About;
