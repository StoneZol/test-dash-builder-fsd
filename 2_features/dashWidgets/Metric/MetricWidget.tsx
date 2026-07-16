'use client';

import { Metric } from '@/3_entities/ui/dashWidgets';
import { Select } from '@/4_shared/components/custom';

import styles from './MetricWidget.module.scss';
import { useMetricWidget } from './MetricWidget.hooks';

type MetricWidgetProps = {
  countryName?: string;
  onCountryChange: (countryName: string) => void;
};

export const MetricWidget = ({
  countryName = '',
  onCountryChange,
}: MetricWidgetProps) => {
  const {
    options,
    metric,
    isLoading,
    error,
    selectLabel,
    isSelectDisabled,
    onRefresh,
  } = useMetricWidget({ countryName, onCountryChange });

  return (
    <div className={styles.root}>
      <Select
        label={selectLabel}
        value={countryName}
        options={options}
        disabled={isSelectDisabled}
        onChange={onCountryChange}
      />
      <Metric
        value={metric?.value ?? '—'}
        description={metric?.description ?? 'Select a country'}
        isLoading={isLoading}
        error={error}
        onRefresh={onRefresh}
      />
    </div>
  );
};
