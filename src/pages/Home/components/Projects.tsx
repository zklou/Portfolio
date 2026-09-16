import { PROJECTS } from '@/constants';
import React from 'react';
import styles from './Projects.less';
import Section from './Section';

const Projects: React.FC = () => (
  <Section
    id="work"
    label="03 · WORK"
    heading="Selected Work"
    theme="brand"
    wide
    tall
  >
    <div className={styles.list}>
      {PROJECTS.map((project, index) => (
        <a
          key={project.title}
          href={project.link}
          target="_blank"
          rel="noreferrer"
          className={styles.entry}
        >
          <span className={styles.index}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className={styles.body}>
            <h3 className={styles.title}>{project.title}</h3>
            <p className={styles.desc}>{project.desc}</p>
          </span>
          <span className={styles.arrow}>↗</span>
        </a>
      ))}
    </div>
  </Section>
);

export default Projects;
