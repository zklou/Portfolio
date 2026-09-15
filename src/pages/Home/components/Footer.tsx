import { CONTACT_EMAIL, SITE_NAME } from '@/constants';
import React from 'react';
import styles from './Footer.less';

const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <span>
      made with <span className={styles.heart}>♥</span> by{' '}
      <span className={styles.name}>{SITE_NAME}</span>
    </span>
    <a className={styles.link} href={`mailto:${CONTACT_EMAIL}`}>
      Get in touch
    </a>
  </footer>
);

export default Footer;
