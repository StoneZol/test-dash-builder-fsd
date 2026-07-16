import Link from 'next/link';

import { useLogo } from './Logo.hooks';
import styles from './Logo.module.scss';
import type { LogoProps } from './Logo.types';

const Logo = ({
    title = 'CountryDash',
    href = '/',
    className,
}: LogoProps) => {
    const { isDev, displayTitle } = useLogo({ title });

    return (
        <Link
            href={href}
            className={[styles.logo, className].filter(Boolean).join(' ')}
            aria-label={displayTitle}
            data-qa="logo"
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
