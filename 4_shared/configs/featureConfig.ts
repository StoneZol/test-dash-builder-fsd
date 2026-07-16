import { envConfig } from './envConfig';

/**
 * Env-dependent UI limits over the shared countries catalog (~100 light entries).
 * Dev keeps option lists short; prod exposes the full catalog.
 */
export const featureConfig = {
  /** Max countries in Metric / News selects. `null` = all from catalog. */
  spotlightCountriesLimit: envConfig.isProduction ? null : 5,

  /** Max countries in Table multi-select. `null` = all from catalog. */
  tableCountriesLimit: envConfig.isProduction ? null : 5,

  /** Max regions in Chart multi-select. `null` = all regions from catalog. */
  chartRegionsLimit: envConfig.isProduction ? null : 3,

  isDevelopment: envConfig.isDevelopment,
  isProduction: envConfig.isProduction,
} as const;

/**
 * Truncate a list for env-dependent UI limits.
 * Pass `null` to return the full list (production “all” behavior).
 */
export const limitList = <T,>(items: T[], limit: number | null): T[] => {
  if (limit == null) {
    return items;
  }

  return items.slice(0, limit);
};

export type FeatureConfig = typeof featureConfig;
