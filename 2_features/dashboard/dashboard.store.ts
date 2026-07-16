'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { getCatalogItem } from './widgetCatalog';
import type {
    DashboardLayoutItem,
    WidgetInstance,
    WidgetType,
} from './dashboard.types';

type DashboardState = {
    widgets: WidgetInstance[];
    layout: DashboardLayoutItem[];
    addWidget: (type: WidgetType) => void;
    removeWidget: (id: string) => void;
    setLayout: (layout: DashboardLayoutItem[]) => void;
};

const createId = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }

    return `widget-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const nextY = (layout: DashboardLayoutItem[]) =>
    layout.reduce((max, item) => Math.max(max, item.y + item.h), 0);

export const useDashboardStore = create<DashboardState>()(
    persist(
        (set, get) => ({
            widgets: [],
            layout: [],
            addWidget: (type) => {
                const catalogItem = getCatalogItem(type);

                if (!catalogItem) {
                    return;
                }

                const id = createId();
                const { layout, widgets } = get();

                set({
                    widgets: [
                        ...widgets,
                        {
                            id,
                            type,
                            settings: { ...catalogItem.defaultSettings },
                        },
                    ],
                    layout: [
                        ...layout,
                        {
                            i: id,
                            x: 0,
                            y: nextY(layout),
                            ...catalogItem.defaultSize,
                        },
                    ],
                });
            },
            removeWidget: (id) => {
                const { widgets, layout } = get();
                set({
                    widgets: widgets.filter((widget) => widget.id !== id),
                    layout: layout.filter((item) => item.i !== id),
                });
            },
            setLayout: (layout) => set({ layout }),
        }),
        {
            name: 'dashboard-config',
            skipHydration: true,
            partialize: (state) => ({
                widgets: state.widgets,
                layout: state.layout,
            }),
        },
    ),
);
