export type WidgetType = 'table' | 'metric' | 'chart' | 'news';

export type WidgetSettings = {
  /** ISO alpha-3 for Metric / News detail query */
  countryCode?: string;
  /** Selected regions for Chart (`?region=` queries) */
  regions?: string[];
  /** ISO alpha-3 list for Table detail queries */
  countryCodes?: string[];
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
