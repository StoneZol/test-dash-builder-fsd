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
  mapCountryToNewsView,
} from '@/3_entities/models/country';
import { featureConfig } from '@/4_shared/configs';

type UseNewsCardWidgetArgs = {
  countryCode: string;
  onCountryChange: (countryCode: string) => void;
};

export const useNewsCardWidget = ({
  countryCode,
  onCountryChange,
}: UseNewsCardWidgetArgs) => {
  const queryClient = useQueryClient();
  const catalogQuery = useCountriesCatalogQuery();
  const detailQuery = useCountryByAlpha3Query(countryCode);

  const options = useMemo(
    () => mapCatalogToSelectOptions(catalogQuery.data ?? []),
    [catalogQuery.data],
  );

  useEffect(() => {
    if (!options.length) return;
    if (options.some((option) => option.value === countryCode)) return;
    onCountryChange(options[0].value);
  }, [options, countryCode, onCountryChange]);

  const news = detailQuery.data
    ? mapCountryToNewsView(detailQuery.data)
    : null;

  return {
    options,
    news,
    isLoading: catalogQuery.isLoading || detailQuery.isLoading,
    error:
      catalogQuery.error || detailQuery.error
        ? ((catalogQuery.error ?? detailQuery.error) as Error).message
        : null,
    selectLabel: featureConfig.isProduction
      ? 'Country (prod · full catalog)'
      : 'Country (dev · API top 5)',
    isSelectDisabled: catalogQuery.isLoading || options.length === 0,
    onRefresh: () => {
      void queryClient.invalidateQueries({
        queryKey: countryCode
          ? countryKeys.byAlpha3(countryCode)
          : countryKeys.catalog(featureConfig.catalogLimit),
      });
    },
  };
};
