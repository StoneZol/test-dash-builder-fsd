'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { countryKeys, getCountries } from '@/3_entities/api/country';
import { Table } from '@/3_entities/ui/dashWidgets';

const COLUMNS = [
  { key: 'name', title: 'Country' },
  { key: 'region', title: 'Region' },
  { key: 'capital', title: 'Capital' },
  { key: 'population', title: 'Population' },
];

export const TableWidget = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: countryKeys.table(),
    queryFn: getCountries,
    select: (countries) =>
      [...countries]
        .sort((a, b) => b.population - a.population)
        .slice(0, 20)
        .map((country) => ({
          cca3: country.cca3,
          name: country.name.common,
          region: country.region,
          capital: country.capital[0] ?? '—',
          population: country.population.toLocaleString('en-US'),
        })),
  });

  return (
    <Table
      columns={COLUMNS}
      rows={query.data ?? []}
      isLoading={query.isLoading || query.isFetching}
      error={query.error ? (query.error as Error).message : null}
      onRefresh={() => {
        void queryClient.invalidateQueries({
          queryKey: countryKeys.table(),
        });
      }}
    />
  );
};
