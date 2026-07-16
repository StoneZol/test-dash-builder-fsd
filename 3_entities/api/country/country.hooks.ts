'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getCountries } from './country.api';
import { countryKeys } from './country.keys';

export const useCountriesQuery = () => {
  return useQuery({
    queryKey: countryKeys.dataset(),
    queryFn: getCountries,
  });
};

export const useInvalidateCountries = () => {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({
      queryKey: countryKeys.dataset(),
    });
};
