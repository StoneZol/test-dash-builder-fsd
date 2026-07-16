export type MetricProps = {
  value: string;
  description?: string;
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  dataQa?: string;
};
