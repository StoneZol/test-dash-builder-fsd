'use client';

import { useMemo } from 'react';

import { useCountriesQuery, useInvalidateCountries } from '@/3_entities/api/country';
import {
  mapCountriesToChartBars,
  mapCountriesToRegionOptions,
} from '@/3_entities/models/country';
import { featureConfig, limitList } from '@/4_shared/configs';

type UseChartWidgetArgs = {
  regions: string[];
};

export const useChartWidget = ({ regions }: UseChartWidgetArgs) => {
  const query = useCountriesQuery();
  const invalidateCountries = useInvalidateCountries();

  const options = useMemo(
    () =>
      limitList(
        mapCountriesToRegionOptions(query.data ?? []),
        featureConfig.chartRegionsLimit,
      ),
    [query.data],
  );

  const bars = useMemo(
    () => mapCountriesToChartBars(query.data ?? [], regions),
    [query.data, regions],
  );

  return {
    options,
    bars,
    isLoading: query.isLoading || query.isFetching,
    error: query.error ? (query.error as Error).message : null,
    selectLabel: featureConfig.isProduction
      ? 'Regions (prod · all from dataset)'
      : 'Regions (dev · top 3)',
    isSelectDisabled: query.isLoading || options.length === 0,
    onRefresh: () => {
      void invalidateCountries();
    },
  };
};
