'use client';

import { Chart } from '@/3_entities/ui/dashWidgets';
import { MultiSelect } from '@/4_shared/components/custom';

import styles from './ChartWidget.module.scss';
import { useChartWidget } from './ChartWidget.hooks';

type ChartWidgetProps = {
  regions: string[];
  onRegionsChange: (regions: string[]) => void;
};

export const ChartWidget = ({
  regions,
  onRegionsChange,
}: ChartWidgetProps) => {
  const {
    options,
    bars,
    isLoading,
    error,
    selectLabel,
    isSelectDisabled,
    onRefresh,
  } = useChartWidget({ regions });

  return (
    <div className={styles.root} data-qa="feature-chart-widget">
      <MultiSelect
        label={selectLabel}
        options={options}
        value={regions}
        searchable
        searchPlaceholder="Filter regions…"
        disabled={isSelectDisabled}
        dataQa="feature-chart-region-multiselect"
        onChange={onRegionsChange}
      />
      <Chart
        bars={bars}
        isLoading={isLoading}
        error={error}
        emptyMessage="Select at least one region to show the chart"
        onRefresh={onRefresh}
        dataQa="entity-chart"
      />
    </div>
  );
};
