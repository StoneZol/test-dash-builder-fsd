'use client';

import { useEffect, useMemo } from 'react';

import { useCountriesQuery, useInvalidateCountries } from '@/3_entities/api/country';
import {
  findCountryByName,
  mapCountriesToSelectOptions,
  mapCountryToNewsView,
} from '@/3_entities/models/country';
import { featureConfig, limitList } from '@/4_shared/configs';

type UseNewsCardWidgetArgs = {
  countryName: string;
  onCountryChange: (countryName: string) => void;
};

export const useNewsCardWidget = ({
  countryName,
  onCountryChange,
}: UseNewsCardWidgetArgs) => {
  const query = useCountriesQuery();
  const invalidateCountries = useInvalidateCountries();

  const options = useMemo(
    () =>
      limitList(
        mapCountriesToSelectOptions(query.data ?? []),
        featureConfig.spotlightCountriesLimit,
      ),
    [query.data],
  );

  useEffect(() => {
    if (!options.length) return;
    if (options.some((option) => option.value === countryName)) return;
    onCountryChange(options[0].value);
  }, [options, countryName, onCountryChange]);

  const country = findCountryByName(query.data ?? [], countryName);
  const news = country ? mapCountryToNewsView(country) : null;

  return {
    options,
    news,
    isLoading: query.isLoading || query.isFetching,
    error: query.error ? (query.error as Error).message : null,
    selectLabel: featureConfig.isProduction
      ? 'Country (prod · full dataset)'
      : 'Country (dev · top 5)',
    isSelectDisabled: query.isLoading || options.length === 0,
    onRefresh: () => {
      void invalidateCountries();
    },
  };
};
