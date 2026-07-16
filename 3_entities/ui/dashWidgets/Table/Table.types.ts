export type TableColumn = {
  key: string;
  title: string;
};

export type TableProps = {
  columns: TableColumn[];
  rows: Array<Record<string, string | number>>;
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  onRefresh?: () => void;
  dataQa?: string;
};
