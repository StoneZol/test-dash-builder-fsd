'use client';

import { cn } from '@/4_shared/lib/utils';

import styles from './Button.module.scss';
import type { ButtonProps } from './Button.types';

/**
 * Shared action button (Refresh, Remove, toolbar actions).
 * Variants follow header chrome: soft border, light blur, accent hover.
 */
const Button = ({
  children,
  variant = 'secondary',
  size = 'md',
  className,
  dataQa,
  type = 'button',
  ...rest
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={cn(styles.button, styles[variant], styles[size], className)}
      data-qa={dataQa}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
