'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { findNextLayoutPosition } from './dashboard.placement';
import { getCatalogItem } from './widgetCatalog';
import type {
  DashboardLayoutItem,
  WidgetInstance,
  WidgetSettings,
  WidgetType,
} from './dashboard.types';

/**
 * Client-only dashboard builder state.
 * Holds widget instances + grid layout; server data stays in React Query.
 */
type DashboardState = {
  widgets: WidgetInstance[];
  layout: DashboardLayoutItem[];
  /** Append a catalog widget and place it in the first free grid cell. */
  addWidget: (type: WidgetType) => void;
  /** Remove a widget and its layout item by id. */
  removeWidget: (id: string) => void;
  /** Replace layout after drag / resize (from react-grid-layout). */
  setLayout: (layout: DashboardLayoutItem[]) => void;
  /** Patch per-widget settings (country, regions, etc.). */
  updateWidgetSettings: (
    id: string,
    settings: Partial<WidgetSettings>,
  ) => void;
};

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `widget-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

/**
 * Persisted dashboard config (`localStorage` key `dashboard-config-v4`).
 * Uses `skipHydration` — call `persist.rehydrate()` after mount to avoid SSR mismatch.
 */
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
        const position = findNextLayoutPosition(
          layout,
          catalogItem.defaultSize,
        );

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
              ...position,
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
      updateWidgetSettings: (id, settings) => {
        const { widgets } = get();
        set({
          widgets: widgets.map((widget) =>
            widget.id === id
              ? {
                  ...widget,
                  settings: {
                    ...widget.settings,
                    ...settings,
                  },
                }
              : widget,
          ),
        });
      },
    }),
    {
      name: 'dashboard-config-v4',
      skipHydration: true,
      partialize: (state) => ({
        widgets: state.widgets,
        layout: state.layout,
      }),
    },
  ),
);
