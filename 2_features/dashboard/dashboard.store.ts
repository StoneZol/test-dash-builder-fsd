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

type DashboardState = {
  widgets: WidgetInstance[];
  layout: DashboardLayoutItem[];
  addWidget: (type: WidgetType) => void;
  removeWidget: (id: string) => void;
  setLayout: (layout: DashboardLayoutItem[]) => void;
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
      name: 'dashboard-config-v3',
      skipHydration: true,
      partialize: (state) => ({
        widgets: state.widgets,
        layout: state.layout,
      }),
    },
  ),
);
