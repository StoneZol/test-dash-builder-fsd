export type ChartBar = {
  label: string;
  value: number;
};

export type ChartProps = {
  bars: ChartBar[];
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  onRefresh?: () => void;
  dataQa?: string;
};
