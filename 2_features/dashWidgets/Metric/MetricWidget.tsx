'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { countryKeys, getCountryByName } from '@/3_entities/api/country';
import { Metric } from '@/3_entities/ui/dashWidgets';

type MetricWidgetProps = {
    countryName: string;
};

export const MetricWidget = ({ countryName }: MetricWidgetProps) => {
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: countryKeys.byName(countryName),
        queryFn: () => getCountryByName(countryName),
        enabled: Boolean(countryName),
    });

    const country = query.data;

    return (
        <Metric
            value={country ? country.population.toLocaleString('en-US') : '—'}
            description={
                country
                    ? `${country.name.common} · ${country.region}`
                    : `Country: ${countryName}`
            }
            isLoading={query.isLoading || query.isFetching}
            error={query.error ? (query.error as Error).message : null}
            onRefresh={() => {
                void queryClient.invalidateQueries({
                    queryKey: countryKeys.byName(countryName),
                });
            }}
        />
    );
};
