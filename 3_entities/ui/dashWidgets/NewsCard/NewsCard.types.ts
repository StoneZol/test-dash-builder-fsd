export type NewsCardProps = {
  title: string;
  subtitle?: string;
  body: string;
  imageUrl?: string;
  imageAlt?: string;
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  dataQa?: string;
};
