'use client';

import { useEffect, useMemo } from 'react';

import { useCountriesQuery, useInvalidateCountries } from '@/3_entities/api/country';
import {
  findCountryByName,
  mapCountriesToSelectOptions,
  mapCountryToMetricView,
} from '@/3_entities/models/country';
import { featureConfig, limitList } from '@/4_shared/configs';

type UseMetricWidgetArgs = {
  countryName: string;
  onCountryChange: (countryName: string) => void;
};

export const useMetricWidget = ({
  countryName,
  onCountryChange,
}: UseMetricWidgetArgs) => {
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
  const metric = country ? mapCountryToMetricView(country) : null;

  return {
    options,
    metric,
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
