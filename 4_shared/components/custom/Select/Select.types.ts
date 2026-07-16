export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = {
  id?: string;
  label?: string;
  value: string;
  options: SelectOption[];
  disabled?: boolean;
  className?: string;
  /** Maps to `data-qa` on the root for e2e / QA selectors. */
  dataQa?: string;
  onChange: (value: string) => void;
};
