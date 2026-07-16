import { envConfig } from './envConfig';

/**
 * Env-dependent UI limits over a shared countries dataset (~100).
 * Dev keeps option lists short; prod exposes the full fetched set.
 */
export const featureConfig = {
  /** Max countries in Metric / News selects. `null` = all from dataset. */
  spotlightCountriesLimit: envConfig.isProduction ? null : 5,

  /** Max countries in Table multi-select. `null` = all from dataset. */
  tableCountriesLimit: envConfig.isProduction ? null : 5,

  /** Max regions in Chart multi-select. `null` = all regions from dataset. */
  chartRegionsLimit: envConfig.isProduction ? null : 3,

  isDevelopment: envConfig.isDevelopment,
  isProduction: envConfig.isProduction,
} as const;

export const limitList = <T,>(items: T[], limit: number | null): T[] => {
  if (limit == null) {
    return items;
  }

  return items.slice(0, limit);
};

export type FeatureConfig = typeof featureConfig;
