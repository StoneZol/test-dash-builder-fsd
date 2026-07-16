/**
 * React Query key factory for the country entity.
 *
 * Rule: same resource → same key (shared cache);
 * different endpoint / params → own key (independent fetch + invalidation).
 */
export const countryKeys = {
  all: ['countries'] as const,

  /**
   * Light name/code/region list for selects.
   * `limit` is part of the key so dev (5) and prod (100) do not share cache entries.
   */
  catalog: (limit: number) =>
    [...countryKeys.all, 'catalog', limit] as const,

  details: () => [...countryKeys.all, 'detail'] as const,
  /** Metric / News / Table row — `GET .../codes.alpha_3/{code}`. */
  byAlpha3: (cca3: string) =>
    [...countryKeys.details(), 'alpha3', cca3] as const,

  lists: () => [...countryKeys.all, 'list'] as const,
  /** Chart bar source — `GET ...?region=`. */
  byRegion: (region: string) =>
    [...countryKeys.lists(), 'region', region] as const,
};
