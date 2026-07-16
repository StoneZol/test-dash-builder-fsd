import styles from './NewsCard.module.scss';
import type { NewsCardProps } from './NewsCard.types';

const NewsCard = ({
    title,
    subtitle,
    body,
    imageUrl,
    imageAlt = '',
    isLoading = false,
    error = null,
    onRefresh,
}: NewsCardProps) => {
    return (
        <article className={styles.root}>
            {onRefresh ? (
                <div className={styles.toolbar}>
                    <button
                        type="button"
                        className={styles.refresh}
                        onClick={onRefresh}
                        disabled={isLoading}
                    >
                        Refresh
                    </button>
                </div>
            ) : null}

            {isLoading ? <p className={styles.state}>Loading…</p> : null}
            {error ? <p className={styles.error}>{error}</p> : null}

            {!isLoading && !error ? (
                <div className={styles.content}>
                    {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            className={styles.image}
                            src={imageUrl}
                            alt={imageAlt}
                        />
                    ) : null}
                    <div className={styles.text}>
                        <h4 className={styles.title}>{title}</h4>
                        {subtitle ? (
                            <p className={styles.subtitle}>{subtitle}</p>
                        ) : null}
                        <p className={styles.body}>{body}</p>
                    </div>
                </div>
            ) : null}
        </article>
    );
};

export default NewsCard;
