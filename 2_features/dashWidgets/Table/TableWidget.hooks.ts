'use client';

import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import {
  countryKeys,
  useCountriesByAlpha3Queries,
  useCountriesCatalogQuery,
} from '@/3_entities/api/country';
import {
  mapCatalogToSelectOptions,
  mapCountriesToTableRows,
  type Country,
} from '@/3_entities/models/country';
import { featureConfig, limitList } from '@/4_shared/configs';

type UseTableWidgetArgs = {
  countryCodes: string[];
};

export const useTableWidget = ({ countryCodes }: UseTableWidgetArgs) => {
  const queryClient = useQueryClient();
  const catalogQuery = useCountriesCatalogQuery();
  const detailQueries = useCountriesByAlpha3Queries(countryCodes);

  const options = useMemo(
    () =>
      limitList(
        mapCatalogToSelectOptions(catalogQuery.data ?? []),
        featureConfig.tableCountriesLimit,
      ),
    [catalogQuery.data],
  );

  const countries = useMemo(
    () =>
      detailQueries
        .map((query) => query.data)
        .filter((country): country is Country => Boolean(country)),
    [detailQueries],
  );

  const rows = useMemo(
    () => mapCountriesToTableRows(countries),
    [countries],
  );

  const isDetailsLoading = detailQueries.some(
    (query) => query.isLoading || query.isPending,
  );
  const detailError = detailQueries.find((query) => query.error)?.error;

  return {
    options,
    rows,
    isLoading:
      catalogQuery.isLoading ||
      (countryCodes.length > 0 && isDetailsLoading),
    error:
      catalogQuery.error || detailError
        ? ((catalogQuery.error ?? detailError) as Error).message
        : null,
    selectLabel: featureConfig.isProduction
      ? 'Countries (prod · catalog + detail queries)'
      : 'Countries (dev · top 5 + detail queries)',
    isSelectDisabled: catalogQuery.isLoading || options.length === 0,
    onRefresh: () => {
      if (countryCodes.length === 0) {
        void queryClient.invalidateQueries({
          queryKey: countryKeys.catalog(),
        });
        return;
      }

      countryCodes.forEach((cca3) => {
        void queryClient.invalidateQueries({
          queryKey: countryKeys.byAlpha3(cca3),
        });
      });
    },
  };
};
