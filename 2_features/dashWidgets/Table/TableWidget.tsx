'use client';

import { MultiSelect } from '@/4_shared/components/custom';
import { Table } from '@/3_entities/ui/dashWidgets';

import styles from './TableWidget.module.scss';
import { useTableWidget } from './TableWidget.hooks';

const COLUMNS = [
  { key: 'name', title: 'Country' },
  { key: 'region', title: 'Region' },
  { key: 'capital', title: 'Capital' },
  { key: 'population', title: 'Population' },
];

type TableWidgetProps = {
  countryNames: string[];
  onCountryNamesChange: (countryNames: string[]) => void;
};

export const TableWidget = ({
  countryNames,
  onCountryNamesChange,
}: TableWidgetProps) => {
  const {
    options,
    rows,
    isLoading,
    error,
    selectLabel,
    isSelectDisabled,
    onRefresh,
  } = useTableWidget({ countryNames });

  return (
    <div className={styles.root}>
      <MultiSelect
        label={selectLabel}
        options={options}
        value={countryNames}
        searchable
        searchPlaceholder="Filter countries…"
        disabled={isSelectDisabled}
        onChange={onCountryNamesChange}
      />
      <Table
        columns={COLUMNS}
        rows={rows}
        isLoading={isLoading}
        error={error}
        emptyMessage="Select at least one country to show the table"
        onRefresh={onRefresh}
      />
    </div>
  );
};
