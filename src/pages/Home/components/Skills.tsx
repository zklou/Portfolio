import { SKILLS } from '@/constants';
import React from 'react';
import Section from './Section';
import styles from './Skills.less';

const Skills: React.FC = () => (
  <Section label="SKILLS · 技能">
    <div className={styles.tags}>
      {SKILLS.map((skill) => (
        <span key={skill} className={styles.tag}>
          {skill}
        </span>
      ))}
    </div>
  </Section>
);

export default Skills;
