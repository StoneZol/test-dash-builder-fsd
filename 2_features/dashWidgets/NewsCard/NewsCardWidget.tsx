'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { countryKeys, getCountryByName } from '@/3_entities/api/country';
import { NewsCard } from '@/3_entities/ui/dashWidgets';

type NewsCardWidgetProps = {
    countryName: string;
};

export const NewsCardWidget = ({ countryName }: NewsCardWidgetProps) => {
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: countryKeys.byName(countryName),
        queryFn: () => getCountryByName(countryName),
        enabled: Boolean(countryName),
    });

    const country = query.data;
    const capital = country?.capital[0] ?? 'unknown capital';

    return (
        <NewsCard
            title={country?.name.common ?? countryName}
            subtitle={country ? `${country.region} · ${country.cca3}` : undefined}
            body={
                country
                    ? `${country.name.official} — capital ${capital}, population ${country.population.toLocaleString('en-US')}.`
                    : 'Country briefing'
            }
            imageUrl={country?.flags?.png}
            imageAlt={country?.flags?.alt ?? country?.name.common}
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
