import { Logo } from '@/4_shared/components/custom';
import { envConfig, featureConfig } from '@/4_shared/configs';

import styles from './Header.module.scss';
import type { HeaderProps } from './Header.types';

const formatLimit = (limit: number | null) =>
  limit == null ? 'all' : String(limit);

const Header = ({}: HeaderProps) => {
  return (
    <header className={styles.header} data-qa="header">
      <div className={styles.inner}>
        <Logo />
        <div className={styles.metaBlock} data-qa="header-meta">
          {envConfig.isProduction ? (
            <p className={styles.meta} data-qa="header-env-production">
              Production
            </p>
          ) : null}
          {envConfig.enableDebugPanel ? (
            <>
              <p className={styles.meta} data-qa="header-env-development">
                Development environment
              </p>
              <p className={styles.debug} data-qa="header-debug-panel">
                debug · light catalog top 100 · spotlight{' '}
                {formatLimit(featureConfig.spotlightCountriesLimit)} · table{' '}
                {formatLimit(featureConfig.tableCountriesLimit)} · regions{' '}
                {formatLimit(featureConfig.chartRegionsLimit)}
              </p>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Header;
