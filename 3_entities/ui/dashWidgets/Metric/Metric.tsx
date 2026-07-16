import { Button } from '@/4_shared/components/custom';

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
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>
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
