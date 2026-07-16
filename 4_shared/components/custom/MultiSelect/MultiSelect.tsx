'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';

import { cn } from '@/4_shared/lib';

import styles from './MultiSelect.module.scss';
import type { MultiSelectProps } from './MultiSelect.types';

const MultiSelect = ({
  label,
  options,
  value,
  disabled = false,
  searchable = true,
  searchPlaceholder = 'Search…',
  className,
  onChange,
}: MultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return options;
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(query),
    );
  }, [options, search]);

  const triggerLabel = useMemo(() => {
    if (value.length === 0) {
      return 'Select…';
    }

    if (value.length === 1) {
      return (
        options.find((option) => option.value === value[0])?.label ??
        value[0]
      );
    }

    if (value.length <= 2) {
      return value
        .map(
          (item) =>
            options.find((option) => option.value === item)?.label ?? item,
        )
        .join(', ');
    }

    return `${value.length} selected`;
  }, [options, value]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const toggle = (optionValue: string) => {
    if (disabled) return;

    if (value.includes(optionValue)) {
      onChange(value.filter((item) => item !== optionValue));
      return;
    }

    onChange([...value, optionValue]);
  };

  return (
    <div className={cn(styles.root, className)} ref={rootRef}>
      {label ? <span className={styles.label}>{label}</span> : null}

      <button
        type="button"
        className={cn(styles.control, open && styles.controlOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          if (disabled) return;
          setOpen((prev) => !prev);
          if (open) {
            setSearch('');
          }
        }}
      >
        <span className={styles.controlText}>{triggerLabel}</span>
        <span className={styles.meta}>
          {value.length}/{options.length}
        </span>
        <span className={styles.chevron} aria-hidden>
          ▾
        </span>
      </button>

      {open ? (
        <div className={styles.dropdown} id={listId} role="listbox">
          {searchable ? (
            <input
              className={styles.search}
              type="search"
              value={search}
              placeholder={searchPlaceholder}
              autoFocus
              onChange={(event) => setSearch(event.target.value)}
              onClick={(event) => event.stopPropagation()}
            />
          ) : null}

          <div className={styles.list}>
            {filteredOptions.length === 0 ? (
              <p className={styles.empty}>No matches</p>
            ) : (
              filteredOptions.map((option) => {
                const active = value.includes(option.value);

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={active}
                    className={cn(styles.option, active && styles.optionActive)}
                    onClick={() => toggle(option.value)}
                  >
                    <input
                      className={styles.checkbox}
                      type="checkbox"
                      checked={active}
                      readOnly
                      tabIndex={-1}
                    />
                    {option.label}
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MultiSelect;
