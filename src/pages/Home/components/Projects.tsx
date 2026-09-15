import { PROJECTS } from '@/constants';
import React from 'react';
import styles from './Projects.less';
import Section from './Section';

const Projects: React.FC = () => (
  <Section label="PROJECTS · 作品" wide>
    <div className={styles.grid}>
      {PROJECTS.map((project) => (
        <a
          key={project.title}
          href={project.link}
          target="_blank"
          rel="noreferrer"
          className={styles.card}
        >
          <h3 className={styles.cardTitle}>{project.title}</h3>
          <p className={styles.cardDesc}>{project.desc}</p>
        </a>
      ))}
    </div>
  </Section>
);

export default Projects;
