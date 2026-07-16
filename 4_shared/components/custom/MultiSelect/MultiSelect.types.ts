import type { SelectOption } from '../Select';

export type MultiSelectProps = {
  label?: string;
  options: SelectOption[];
  value: string[];
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
  /** Maps to `data-qa` on the root for e2e / QA selectors. */
  dataQa?: string;
  onChange: (value: string[]) => void;
};
