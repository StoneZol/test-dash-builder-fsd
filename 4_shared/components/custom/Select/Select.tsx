import { cn } from '@/4_shared/lib';

import styles from './Select.module.scss';
import type { SelectProps } from './Select.types';

const Select = ({
  id,
  label,
  value,
  options,
  disabled = false,
  className,
  dataQa,
  onChange,
}: SelectProps) => {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <label
      className={cn(styles.root, className)}
      htmlFor={selectId}
      data-qa={dataQa}
    >
      {label ? <span className={styles.label}>{label}</span> : null}
      <select
        id={selectId}
        className={styles.control}
        value={value}
        disabled={disabled}
        data-qa={dataQa ? `${dataQa}-control` : undefined}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};

export default Select;
