'use client';

import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import {
  countryKeys,
  useCountriesByRegionQueries,
  useCountriesCatalogQuery,
} from '@/3_entities/api/country';
import {
  mapCatalogToRegionOptions,
  mapCountriesToChartBars,
  type Country,
} from '@/3_entities/models/country';
import { featureConfig, limitList } from '@/4_shared/configs';

type UseChartWidgetArgs = {
  regions: string[];
};

export const useChartWidget = ({ regions }: UseChartWidgetArgs) => {
  const queryClient = useQueryClient();
  const catalogQuery = useCountriesCatalogQuery();
  const regionQueries = useCountriesByRegionQueries(regions);

  const options = useMemo(
    () =>
      limitList(
        mapCatalogToRegionOptions(catalogQuery.data ?? []),
        featureConfig.chartRegionsLimit,
      ),
    [catalogQuery.data],
  );

  const bars = useMemo(
    () =>
      mapCountriesToChartBars(
        regions.map((region, index) => ({
          region,
          countries: (regionQueries[index]?.data ?? []) as Country[],
        })),
      ),
    [regions, regionQueries],
  );

  const isRegionsLoading = regionQueries.some(
    (query) => query.isLoading || query.isPending,
  );
  const regionError = regionQueries.find((query) => query.error)?.error;

  return {
    options,
    bars,
    isLoading:
      catalogQuery.isLoading || (regions.length > 0 && isRegionsLoading),
    error:
      catalogQuery.error || regionError
        ? ((catalogQuery.error ?? regionError) as Error).message
        : null,
    selectLabel: featureConfig.isProduction
      ? 'Regions (prod · all)'
      : 'Regions (dev · top 3)',
    isSelectDisabled: catalogQuery.isLoading || options.length === 0,
    onRefresh: () => {
      if (regions.length === 0) {
        void queryClient.invalidateQueries({
          queryKey: countryKeys.catalog(featureConfig.catalogLimit),
        });
        return;
      }

      regions.forEach((region) => {
        void queryClient.invalidateQueries({
          queryKey: countryKeys.byRegion(region),
        });
      });
    },
  };
};
