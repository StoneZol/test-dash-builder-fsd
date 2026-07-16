'use client';

import { useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import {
  countryKeys,
  useCountriesCatalogQuery,
  useCountryByAlpha3Query,
} from '@/3_entities/api/country';
import {
  mapCatalogToSelectOptions,
  mapCountryToMetricView,
} from '@/3_entities/models/country';
import { featureConfig, limitList } from '@/4_shared/configs';

type UseMetricWidgetArgs = {
  countryCode: string;
  onCountryChange: (countryCode: string) => void;
};

export const useMetricWidget = ({
  countryCode,
  onCountryChange,
}: UseMetricWidgetArgs) => {
  const queryClient = useQueryClient();
  const catalogQuery = useCountriesCatalogQuery();
  const detailQuery = useCountryByAlpha3Query(countryCode);

  const options = useMemo(
    () =>
      limitList(
        mapCatalogToSelectOptions(catalogQuery.data ?? []),
        featureConfig.spotlightCountriesLimit,
      ),
    [catalogQuery.data],
  );

  useEffect(() => {
    if (!options.length) return;
    if (options.some((option) => option.value === countryCode)) return;
    onCountryChange(options[0].value);
  }, [options, countryCode, onCountryChange]);

  const metric = detailQuery.data
    ? mapCountryToMetricView(detailQuery.data)
    : null;

  return {
    options,
    metric,
    isLoading: catalogQuery.isLoading || detailQuery.isLoading,
    error:
      catalogQuery.error || detailQuery.error
        ? ((catalogQuery.error ?? detailQuery.error) as Error).message
        : null,
    selectLabel: featureConfig.isProduction
      ? 'Country (prod · full catalog)'
      : 'Country (dev · top 5)',
    isSelectDisabled: catalogQuery.isLoading || options.length === 0,
    onRefresh: () => {
      void queryClient.invalidateQueries({
        queryKey: countryCode
          ? countryKeys.byAlpha3(countryCode)
          : countryKeys.catalog(),
      });
    },
  };
};
