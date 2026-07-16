import { featureConfig } from '@/4_shared/configs';

import type { WidgetCatalogItem, WidgetType } from './dashboard.types';

export const WIDGET_CATALOG: WidgetCatalogItem[] = [
  {
    type: 'table',
    title: 'Table',
    description: featureConfig.isProduction
      ? 'Detail queries per selected country (prod catalog)'
      : 'Detail queries · top 5 catalog options (dev)',
    defaultSettings: {
      countryCodes: [],
    },
    defaultSize: { w: 6, h: 10, minW: 4, minH: 6 },
  },
  {
    type: 'metric',
    title: 'Statistics',
    description: featureConfig.isProduction
      ? 'Detail by alpha-3 · full catalog'
      : 'Detail by alpha-3 · top 5 catalog (dev)',
    defaultSettings: {},
    defaultSize: { w: 3, h: 5, minW: 2, minH: 4 },
  },
  {
    type: 'chart',
    title: 'Chart',
    description: featureConfig.isProduction
      ? 'Population by region · ?region= queries'
      : 'Population by region · 3 regions (dev)',
    defaultSettings: {
      regions: [],
    },
    defaultSize: { w: 6, h: 10, minW: 4, minH: 6 },
  },
  {
    type: 'news',
    title: 'News card',
    description: featureConfig.isProduction
      ? 'Briefing via alpha-3 detail · full catalog'
      : 'Briefing via alpha-3 detail · top 5 (dev)',
    defaultSettings: {},
    defaultSize: { w: 3, h: 6, minW: 2, minH: 5 },
  },
];

export const getCatalogItem = (type: WidgetType) =>
  WIDGET_CATALOG.find((item) => item.type === type);
