import type { WidgetCatalogItem, WidgetType } from './dashboard.types';

export const WIDGET_CATALOG: WidgetCatalogItem[] = [
    {
        type: 'table',
        title: 'Table',
        description: 'Top countries by population',
        defaultSettings: {},
        defaultSize: { w: 6, h: 8, minW: 4, minH: 5 },
    },
    {
        type: 'metric',
        title: 'Statistics',
        description: 'Population metric for a country',
        defaultSettings: { countryName: 'germany' },
        defaultSize: { w: 3, h: 4, minW: 2, minH: 3 },
    },
    {
        type: 'chart',
        title: 'Chart',
        description: 'Population aggregated by region',
        defaultSettings: {},
        defaultSize: { w: 6, h: 8, minW: 4, minH: 5 },
    },
    {
        type: 'news',
        title: 'News card',
        description: 'Country briefing card',
        defaultSettings: { countryName: 'japan' },
        defaultSize: { w: 3, h: 5, minW: 2, minH: 4 },
    },
];

export const getCatalogItem = (type: WidgetType) =>
    WIDGET_CATALOG.find((item) => item.type === type);
