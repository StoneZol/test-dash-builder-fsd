import { Logo } from '@/4_shared/components/custom';

import { useHeader } from './Header.hooks';
import styles from './Header.module.scss';
import type { HeaderProps } from './Header.types';

const Header = ({ }: HeaderProps) => {
    const { showProduction, showDebugPanel, debugText } = useHeader();

    return (
        <header className={styles.header} data-qa="header">
            <div className={styles.inner}>
                <Logo />
                <div className={styles.metaBlock} data-qa="header-meta">
                    {showProduction ? (
                        <p className={styles.meta} data-qa="header-env-production">
                            Production
                        </p>
                    ) : null}
                    {showDebugPanel ? (
                        <>
                            <p className={styles.meta} data-qa="header-env-development">
                                Development environment
                            </p>
                            {debugText ? (
                                <p className={styles.debug} data-qa="header-debug-panel">
                                    {debugText}
                                </p>
                            ) : null}
                        </>
                    ) : null}
                </div>
            </div>
        </header>
    );
};

export default Header;
