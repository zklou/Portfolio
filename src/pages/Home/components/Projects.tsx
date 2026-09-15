import { PROJECTS } from '@/constants';
import React from 'react';
import styles from './Projects.less';
import Section from './Section';

const Projects: React.FC = () => (
  <Section label="PROJECTS · 作品" wide tall>
    <div className={styles.grid}>
      {PROJECTS.map((project, index) => (
        <a
          key={project.title}
          href={project.link}
          target="_blank"
          rel="noreferrer"
          className={styles.card}
        >
          <span className={styles.cardIndex}>
            {String(index + 1).padStart(2, '0')}.
          </span>
          <h3 className={styles.cardTitle}>{project.title}</h3>
          <p className={styles.cardDesc}>{project.desc}</p>
        </a>
      ))}
    </div>
  </Section>
);

export default Projects;
