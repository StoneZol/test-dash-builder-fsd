import { Logo } from '@/4_shared/components/custom';

import styles from './Footer.module.scss';
import type { FooterProps } from './Footer.types';

const Footer = ({}: FooterProps) => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} data-qa="footer">
      <div className={styles.inner}>
        <Logo />
        <p className={styles.copy} data-qa="footer-copy">
          © {year} CountryDash · Dashboard Builder
        </p>
      </div>
    </footer>
  );
};

export default Footer;
