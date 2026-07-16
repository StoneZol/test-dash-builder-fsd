'use client';

import { NewsCard } from '@/3_entities/ui/dashWidgets';
import { Select } from '@/4_shared/components/custom';

import styles from './NewsCardWidget.module.scss';
import { useNewsCardWidget } from './NewsCardWidget.hooks';

type NewsCardWidgetProps = {
  countryName?: string;
  onCountryChange: (countryName: string) => void;
};

export const NewsCardWidget = ({
  countryName = '',
  onCountryChange,
}: NewsCardWidgetProps) => {
  const {
    options,
    news,
    isLoading,
    error,
    selectLabel,
    isSelectDisabled,
    onRefresh,
  } = useNewsCardWidget({ countryName, onCountryChange });

  return (
    <div className={styles.root}>
      <Select
        label={selectLabel}
        value={countryName}
        options={options}
        disabled={isSelectDisabled}
        onChange={onCountryChange}
      />
      <NewsCard
        title={news?.title ?? (countryName || 'Country')}
        subtitle={news?.subtitle}
        body={news?.body ?? 'Country briefing'}
        imageUrl={news?.imageUrl}
        imageAlt={news?.imageAlt}
        isLoading={isLoading}
        error={error}
        onRefresh={onRefresh}
      />
    </div>
  );
};
