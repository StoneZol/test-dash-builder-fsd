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
  onChange: (value: string) => void;
};
