import { SITE_NAME } from '@/constants';
import React from 'react';
import styles from './Nav.less';

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
  </nav>
);

export default Nav;
