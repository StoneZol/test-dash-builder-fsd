import { featureConfig } from '@/4_shared/configs';

import type { WidgetCatalogItem, WidgetType } from './dashboard.types';

export const WIDGET_CATALOG: WidgetCatalogItem[] = [
  {
    type: 'table',
    title: 'Table',
    description: featureConfig.isProduction
      ? 'Pick countries from full dataset (prod)'
      : 'Pick from top 5 countries (dev)',
    defaultSettings: {
      countryNames: [],
    },
    defaultSize: { w: 6, h: 10, minW: 4, minH: 6 },
  },
  {
    type: 'metric',
    title: 'Statistics',
    description: featureConfig.isProduction
      ? 'Population metric · all countries'
      : 'Population metric · top 5 countries (dev)',
    defaultSettings: {},
    defaultSize: { w: 3, h: 5, minW: 2, minH: 4 },
  },
  {
    type: 'chart',
    title: 'Chart',
    description: featureConfig.isProduction
      ? 'Population by region · all regions'
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
      ? 'Country briefing · all countries'
      : 'Country briefing · top 5 countries (dev)',
    defaultSettings: {},
    defaultSize: { w: 3, h: 6, minW: 2, minH: 5 },
  },
];

export const getCatalogItem = (type: WidgetType) =>
  WIDGET_CATALOG.find((item) => item.type === type);
