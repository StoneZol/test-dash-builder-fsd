import { Button } from '@/4_shared/components/custom';

import styles from './Chart.module.scss';
import type { ChartProps } from './Chart.types';

const Chart = ({
  bars,
  isLoading = false,
  error = null,
  emptyMessage = 'Nothing to show',
  onRefresh,
  dataQa = 'chart',
}: ChartProps) => {
  const max = Math.max(...bars.map((bar) => bar.value), 1);
  const isEmpty = !isLoading && !error && bars.length === 0;

  return (
    <article className={styles.root} data-qa={dataQa}>
      {onRefresh ? (
        <div className={styles.toolbar}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            dataQa={`${dataQa}-refresh`}
            onClick={onRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </div>
      ) : null}

      {isLoading ? (
        <p className={styles.state} data-qa={`${dataQa}-loading`}>
          Loading…
        </p>
      ) : null}
      {error ? (
        <p className={styles.error} data-qa={`${dataQa}-error`}>
          {error}
        </p>
      ) : null}
      {isEmpty ? (
        <p className={styles.state} data-qa={`${dataQa}-empty`}>
          {emptyMessage}
        </p>
      ) : null}

      {!isLoading && !error && !isEmpty ? (
        <ul className={styles.bars} data-qa={`${dataQa}-bars`}>
          {bars.map((bar) => (
            <li
              key={bar.label}
              className={styles.barItem}
              data-qa={`${dataQa}-bar-${bar.label}`}
            >
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
