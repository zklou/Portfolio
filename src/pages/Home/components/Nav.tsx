import { SITE_NAME, SOCIAL_LINKS } from '@/constants';
import React from 'react';
import styles from './Nav.less';

const resume = SOCIAL_LINKS.find((link) => link.label === 'Resume');

const Nav: React.FC = () => (
  <nav className={styles.nav}>
    <a className={styles.brand} href="#top">
      {SITE_NAME}
    </a>
    <div className={styles.links}>
      <a href="#about">About</a>
      <a href="#skills">Skills</a>
      <a href="#work">Work</a>
      <a href="#contact">Contact</a>
    </div>
    {resume && (
      <a
        className={styles.cta}
        href={resume.url}
        target="_blank"
        rel="noreferrer"
      >
        Resume
      </a>
    )}
  </nav>
);

export default Nav;
