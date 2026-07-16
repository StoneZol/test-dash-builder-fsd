import { Button } from '@/4_shared/components/custom';

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
  dataQa = 'news-card',
}: NewsCardProps) => {
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
        <div className={styles.content} data-qa={`${dataQa}-content`}>
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className={styles.image}
              src={imageUrl}
              alt={imageAlt}
              data-qa={`${dataQa}-image`}
            />
          ) : null}
          <div className={styles.text}>
            <h4 className={styles.title} data-qa={`${dataQa}-title`}>
              {title}
            </h4>
            {subtitle ? (
              <p className={styles.subtitle} data-qa={`${dataQa}-subtitle`}>
                {subtitle}
              </p>
            ) : null}
            <p className={styles.body} data-qa={`${dataQa}-body`}>
              {body}
            </p>
          </div>
        </div>
      ) : null}
    </article>
  );
};

export default NewsCard;
