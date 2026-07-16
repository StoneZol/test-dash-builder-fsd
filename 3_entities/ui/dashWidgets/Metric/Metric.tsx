import styles from './Metric.module.scss';
import type { MetricProps } from './Metric.types';

const Metric = ({
    value,
    description,
    isLoading = false,
    error = null,
    onRefresh,
}: MetricProps) => {
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
                <>
                    <p className={styles.value}>{value}</p>
                    {description ? (
                        <p className={styles.description}>{description}</p>
                    ) : null}
                </>
            ) : null}
        </article>
    );
};

export default Metric;
