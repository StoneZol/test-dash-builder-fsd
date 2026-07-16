export type WidgetType = 'table' | 'metric' | 'chart' | 'news';

export type WidgetSettings = {
    countryName?: string;
};

export type WidgetInstance = {
    id: string;
    type: WidgetType;
    settings: WidgetSettings;
};

export type DashboardLayoutItem = {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
};

export type WidgetCatalogItem = {
    type: WidgetType;
    title: string;
    description: string;
    defaultSettings: WidgetSettings;
    defaultSize: Pick<DashboardLayoutItem, 'w' | 'h' | 'minW' | 'minH'>;
};
