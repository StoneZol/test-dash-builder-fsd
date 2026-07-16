import { clsx, type ClassValue } from 'clsx';

/**
 * Conditionally join class names (`clsx`).
 * Prefer over string concatenation for optional / conditional CSS module classes.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
