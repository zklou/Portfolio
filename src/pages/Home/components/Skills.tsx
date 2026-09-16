import { SKILLS } from '@/constants';
import React from 'react';
import Section from './Section';
import styles from './Skills.less';

const Skills: React.FC = () => (
  <Section label="SKILLS · 技能" heading="Skills &amp; Tools" theme="paper">
    <p className={styles.line}>
      {SKILLS.map((skill, index) => (
        <React.Fragment key={skill}>
          {index > 0 && <span className={styles.slash}> / </span>}
          {skill}
        </React.Fragment>
      ))}
    </p>
  </Section>
);

export default Skills;
