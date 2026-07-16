import type { SelectOption } from '../Select';

export type MultiSelectProps = {
  label?: string;
  options: SelectOption[];
  value: string[];
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
  onChange: (value: string[]) => void;
};
