import styles from './Chart.module.scss';
import type { ChartProps } from './Chart.types';

const Chart = ({
    bars,
    isLoading = false,
    error = null,
    onRefresh,
}: ChartProps) => {
    const max = Math.max(...bars.map((bar) => bar.value), 1);

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
                <ul className={styles.bars}>
                    {bars.map((bar) => (
                        <li key={bar.label} className={styles.barItem}>
                            <div className={styles.barMeta}>
                                <span>{bar.label}</span>
                                <span>{bar.value.toLocaleString('en-US')}</span>
                            </div>
                            <div className={styles.track}>
                                <div
                                    className={styles.fill}
                                    style={{ width: `${(bar.value / max) * 100}%` }}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            ) : null}
        </article>
    );
};

export default Chart;
