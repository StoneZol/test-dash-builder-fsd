'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { countryKeys, getCountries } from '@/3_entities/api/country';
import { Chart } from '@/3_entities/ui/dashWidgets';

export const ChartWidget = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: countryKeys.chart(),
    queryFn: getCountries,
    select: (countries) => {
      const byRegion = countries.reduce<Record<string, number>>(
        (acc, country) => {
          acc[country.region] = (acc[country.region] ?? 0) + country.population;
          return acc;
        },
        {},
      );

      return Object.entries(byRegion)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value);
    },
  });

  return (
    <Chart
      bars={query.data ?? []}
      isLoading={query.isLoading || query.isFetching}
      error={query.error ? (query.error as Error).message : null}
      onRefresh={() => {
        void queryClient.invalidateQueries({
          queryKey: countryKeys.chart(),
        });
      }}
    />
  );
};
