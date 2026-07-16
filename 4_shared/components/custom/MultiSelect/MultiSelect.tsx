'use client';

import { useId } from 'react';

import { cn } from '@/4_shared/lib';

import { useMultiSelect } from './MultiSelect.hooks';
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
    dataQa,
    onChange,
}: MultiSelectProps) => {
    const listId = useId();
    const {
        open,
        search,
        setSearch,
        rootRef,
        filteredOptions,
        triggerLabel,
        toggleOpen,
        toggleOption,
    } = useMultiSelect({ options, value, disabled, onChange });

    return (
        <div className={cn(styles.root, className)} ref={rootRef} data-qa={dataQa}>
            {label ? <span className={styles.label}>{label}</span> : null}

            <button
                type="button"
                className={cn(styles.control, open && styles.controlOpen)}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listId}
                data-qa={dataQa ? `${dataQa}-trigger` : undefined}
                onClick={toggleOpen}
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
                <div
                    className={styles.dropdown}
                    id={listId}
                    role="listbox"
                    data-qa={dataQa ? `${dataQa}-dropdown` : undefined}
                >
                    {searchable ? (
                        <input
                            className={styles.search}
                            type="search"
                            value={search}
                            placeholder={searchPlaceholder}
                            autoFocus
                            data-qa={dataQa ? `${dataQa}-search` : undefined}
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
                                        data-qa={
                                            dataQa ? `${dataQa}-option-${option.value}` : undefined
                                        }
                                        onClick={() => toggleOption(option.value)}
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
