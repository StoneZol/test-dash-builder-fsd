import Link from 'next/link';

import { envConfig } from '@/4_shared/configs';

import styles from './Logo.module.scss';
import type { LogoProps } from './Logo.types';

const Logo = ({
  title = 'CountryDash',
  href = '/',
  className,
}: LogoProps) => {
  const isDev = envConfig.isDevelopment;
  const displayTitle = isDev ? `${title} Dev` : title;

  return (
    <Link
      href={href}
      className={[styles.logo, className].filter(Boolean).join(' ')}
      aria-label={displayTitle}
    >
      <span className={styles.mark} aria-hidden>
        CD
      </span>
      <span className={styles.title}>
        {title}
        {isDev ? <span className={styles.dev}> Dev</span> : null}
      </span>
    </Link>
  );
};

export default Logo;
