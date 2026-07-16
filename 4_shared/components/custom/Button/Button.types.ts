import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'secondary' | 'ghost' | 'accent' | 'danger';
export type ButtonSize = 'sm' | 'md';

export type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'>;
