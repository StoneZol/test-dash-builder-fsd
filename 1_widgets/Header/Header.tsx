import { Logo } from '@/4_shared/components/custom';
import { envConfig } from '@/4_shared/configs';

import styles from './Header.module.scss';
import type { HeaderProps } from './Header.types';

const Header = ({}: HeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Logo />
        <p className={styles.meta}>
          {envConfig.isDevelopment ? 'Development environment' : 'Production'}
        </p>
      </div>
    </header>
  );
};

export default Header;
