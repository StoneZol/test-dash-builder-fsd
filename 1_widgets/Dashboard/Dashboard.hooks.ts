'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
    useContainerWidth,
    type Layout,
} from 'react-grid-layout';

import {
    DASHBOARD_COLS,
    getCatalogItem,
    useDashboardStore,
    WIDGET_CATALOG,
    type WidgetInstance,
    type WidgetType,
} from '@/2_features/dashboard';
import {
    countryKeys,
    useCountriesCatalogQuery,
} from '@/3_entities/api/country';

/** Grid column count shared with placement algorithm. */
export const DASHBOARD_GRID_COLS = DASHBOARD_COLS;

export const getWidgetTitle = (widget: WidgetInstance) =>
    getCatalogItem(widget.type)?.title ?? widget.type;

/**
 * Dashboard widget: store, hydrate, grid measure, catalog prefetch, actions.
 */
export const useDashboard = () => {
    const queryClient = useQueryClient();
    const { width, containerRef, mounted, measureWidth } = useContainerWidth({
        measureBeforeMount: true,
    });
    const [hydrated, setHydrated] = useState(false);

    const widgets = useDashboardStore((state) => state.widgets);
    const layout = useDashboardStore((state) => state.layout);
    const addWidget = useDashboardStore((state) => state.addWidget);
    const removeWidget = useDashboardStore((state) => state.removeWidget);
    const setLayout = useDashboardStore((state) => state.setLayout);
    const updateWidgetSettings = useDashboardStore(
        (state) => state.updateWidgetSettings,
    );

    useCountriesCatalogQuery({ enabled: widgets.length > 0 });

    useEffect(() => {
        const result = useDashboardStore.persist.rehydrate();
        Promise.resolve(result).finally(() => {
            setHydrated(true);
        });
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        measureWidth();
    }, [hydrated, measureWidth, widgets.length]);

    const handleLayoutChange = (nextLayout: Layout) => {
        setLayout(
            nextLayout.map((item) => ({
                i: item.i,
                x: item.x,
                y: item.y,
                w: item.w,
                h: item.h,
                minW: item.minW,
                minH: item.minH,
            })),
        );
    };

    const handleInvalidateCountriesCache = () => {
        void queryClient.invalidateQueries({
            queryKey: countryKeys.all,
        });
    };

    const handleAddWidget = (type: WidgetType) => {
        addWidget(type);
    };

    const handleRemoveWidget = (id: string) => {
        removeWidget(id);
    };

    return {
        hydrated,
        widgets,
        layout,
        catalog: WIDGET_CATALOG,
        width,
        containerRef,
        mounted,
        handleLayoutChange,
        handleInvalidateCountriesCache,
        handleAddWidget,
        handleRemoveWidget,
        updateWidgetSettings,
    };
};
