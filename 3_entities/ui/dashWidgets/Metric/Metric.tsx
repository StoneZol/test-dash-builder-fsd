import { Button } from '@/4_shared/components/custom';

import styles from './Metric.module.scss';
import type { MetricProps } from './Metric.types';

const Metric = ({
  value,
  description,
  isLoading = false,
  error = null,
  onRefresh,
  dataQa = 'metric',
}: MetricProps) => {
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
      {!isLoading && !error ? (
        <>
          <p className={styles.value} data-qa={`${dataQa}-value`}>
            {value}
          </p>
          {description ? (
            <p className={styles.description} data-qa={`${dataQa}-description`}>
              {description}
            </p>
          ) : null}
        </>
      ) : null}
    </article>
  );
};

export default Metric;
