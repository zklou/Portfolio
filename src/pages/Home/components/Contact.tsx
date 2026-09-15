import { CONTACT_EMAIL, SOCIAL_LINKS } from '@/constants';
import React from 'react';
import styles from './Contact.less';
import Section from './Section';

const Contact: React.FC = () => (
  <Section label="CONTACT · 联系">
    <p className={styles.text}>期待与你聊聊新的项目或合作。</p>
    <a className={styles.email} href={`mailto:${CONTACT_EMAIL}`}>
      {CONTACT_EMAIL}
    </a>
    <div className={styles.social}>
      {SOCIAL_LINKS.map((link, index) => (
        <React.Fragment key={link.label}>
          {index > 0 && <span className={styles.dot}>·</span>}
          <a
            className={styles.socialLink}
            href={link.url}
            target="_blank"
            rel="noreferrer"
          >
            {link.label}
          </a>
        </React.Fragment>
      ))}
    </div>
  </Section>
);

export default Contact;
