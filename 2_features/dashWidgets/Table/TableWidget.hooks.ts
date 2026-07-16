'use client';

import { useMemo } from 'react';

import { useCountriesQuery, useInvalidateCountries } from '@/3_entities/api/country';
import {
  mapCountriesToSelectOptions,
  mapCountriesToTableRows,
} from '@/3_entities/models/country';
import { featureConfig, limitList } from '@/4_shared/configs';

type UseTableWidgetArgs = {
  countryNames: string[];
};

export const useTableWidget = ({ countryNames }: UseTableWidgetArgs) => {
  const query = useCountriesQuery();
  const invalidateCountries = useInvalidateCountries();

  const options = useMemo(
    () =>
      limitList(
        mapCountriesToSelectOptions(query.data ?? []),
        featureConfig.tableCountriesLimit,
      ),
    [query.data],
  );

  const rows = useMemo(
    () => mapCountriesToTableRows(query.data ?? [], countryNames),
    [countryNames, query.data],
  );

  return {
    options,
    rows,
    isLoading: query.isLoading || query.isFetching,
    error: query.error ? (query.error as Error).message : null,
    selectLabel: featureConfig.isProduction
      ? 'Countries (prod · full dataset)'
      : 'Countries (dev · top 5)',
    isSelectDisabled: query.isLoading || options.length === 0,
    onRefresh: () => {
      void invalidateCountries();
    },
  };
};
