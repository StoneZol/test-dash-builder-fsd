'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import type { SelectOption } from '../Select';

type UseMultiSelectArgs = {
    options: SelectOption[];
    value: string[];
    disabled?: boolean;
    onChange: (value: string[]) => void;
};

/**
 * MultiSelect open/search/filter/toggle + outside click / Escape.
 */
export const useMultiSelect = ({
    options,
    value,
    disabled = false,
    onChange,
}: UseMultiSelectArgs) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const rootRef = useRef<HTMLDivElement>(null);

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
                options.find((option) => option.value === value[0])?.label ?? value[0]
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

    const toggleOpen = () => {
        if (disabled) return;

        setOpen((prev) => {
            const next = !prev;
            if (!next) {
                setSearch('');
            }
            return next;
        });
    };

    const toggleOption = (optionValue: string) => {
        if (disabled) return;

        if (value.includes(optionValue)) {
            onChange(value.filter((item) => item !== optionValue));
            return;
        }

        onChange([...value, optionValue]);
    };

    return {
        open,
        search,
        setSearch,
        rootRef,
        filteredOptions,
        triggerLabel,
        toggleOpen,
        toggleOption,
    };
};
