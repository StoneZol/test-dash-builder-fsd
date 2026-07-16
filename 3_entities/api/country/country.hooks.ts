'use client';

import {
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { featureConfig } from '@/4_shared/configs';

import {
  getCountriesByRegion,
  getCountriesCatalog,
  getCountryByAlpha3,
} from './country.api';
import { countryKeys } from './country.keys';

const CATALOG_QUERY_OPTIONS = {
  staleTime: 1000 * 60 * 30,
  gcTime: 1000 * 60 * 60,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
} as const;

type EnabledOption = {
  enabled?: boolean;
};

/** Shared light catalog for selects (`countryKeys.catalog(limit)`).
 * Prefetched on the server in `app/page.tsx` and hydrated via HydrationBoundary.
 * Size is env-limited on the API (`featureConfig.catalogLimit`).
 */
export const useCountriesCatalogQuery = (options: EnabledOption = {}) => {
  const { enabled = true } = options;
  const limit = featureConfig.catalogLimit;

  return useQuery({
    queryKey: countryKeys.catalog(limit),
    queryFn: getCountriesCatalog,
    enabled,
    ...CATALOG_QUERY_OPTIONS,
  });
};

/** Single-country detail by alpha-3 — Metric / News. */
export const useCountryByAlpha3Query = (
  cca3: string,
  options: EnabledOption = {},
) => {
  const { enabled = true } = options;

  return useQuery({
    queryKey: countryKeys.byAlpha3(cca3),
    queryFn: () => getCountryByAlpha3(cca3),
    enabled: enabled && Boolean(cca3),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

/** Parallel detail queries for Table selected codes. */
export const useCountriesByAlpha3Queries = (codes: string[]) => {
  return useQueries({
    queries: codes.map((cca3) => ({
      queryKey: countryKeys.byAlpha3(cca3),
      queryFn: () => getCountryByAlpha3(cca3),
      enabled: Boolean(cca3),
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 60,
      refetchOnMount: false as const,
      refetchOnWindowFocus: false as const,
      refetchOnReconnect: false as const,
    })),
  });
};

/** Parallel region list queries for Chart. */
export const useCountriesByRegionQueries = (regions: string[]) => {
  return useQueries({
    queries: regions.map((region) => ({
      queryKey: countryKeys.byRegion(region),
      queryFn: () => getCountriesByRegion(region),
      enabled: Boolean(region),
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 60,
      refetchOnMount: false as const,
      refetchOnWindowFocus: false as const,
      refetchOnReconnect: false as const,
    })),
  });
};

/** Invalidate shared catalog (select options). */
export const useInvalidateCountriesCatalog = () => {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({
      queryKey: countryKeys.catalog(featureConfig.catalogLimit),
    });
};

/** Invalidate all country queries (catalog + details + lists). */
export const useInvalidateAllCountries = () => {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({
      queryKey: countryKeys.all,
    });
};
