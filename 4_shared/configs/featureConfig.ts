import { envConfig } from './envConfig';

/**
 * Env-dependent catalog size and UI limits.
 * Dev fetches a short catalog from the API; prod gets the full top-100 list.
 */
export const featureConfig = {
  /**
   * How many countries the `/api/countries/catalog` endpoint returns.
   * Applied on the server — client does not download unused options.
   */
  catalogLimit: envConfig.isProduction ? 100 : 5,

  /** Max regions in Chart multi-select (derived from catalog). `null` = all. */
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
