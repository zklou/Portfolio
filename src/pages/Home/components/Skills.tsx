import { SKILLS } from '@/constants';
import React from 'react';
import Section from './Section';
import styles from './Skills.less';

const Skills: React.FC = () => (
  <Section
    id="skills"
    label="02 · SKILLS"
    heading="Skills &amp; Tools"
    theme="light"
  >
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
