import { requestWithSchema } from '@/4_shared/api';
import { envConfig } from '@/4_shared/configs';
import {
  countriesV5ResponseSchema,
  mapCountryV5ToDomain,
  type Country,
} from '@/3_entities/models/country';

const RESPONSE_FIELDS = [
  'names.common',
  'names.official',
  'codes.alpha_3',
  'population',
  'region',
  'capitals',
  'flag',
].join(',');

const buildProxyUrl = (path = '', query: Record<string, string> = {}) => {
  const base = envConfig.appApiBaseUrl.replace(/\/$/, '');
  const pathname = path ? `${base}/countries/${path.replace(/^\//, '')}` : `${base}/countries`;
  const params = new URLSearchParams({
    response_fields: RESPONSE_FIELDS,
    ...query,
  });

  return `${pathname}?${params.toString()}`;
};

export const getCountries = async (): Promise<Country[]> => {
  const response = await requestWithSchema({
    url: buildProxyUrl('', { limit: '100' }),
    schema: countriesV5ResponseSchema,
  });

  return response.data.objects.map(mapCountryV5ToDomain);
};

export const getCountryByName = async (name: string): Promise<Country> => {
  const response = await requestWithSchema({
    url: buildProxyUrl('', {
      q: name,
      limit: '1',
    }),
    schema: countriesV5ResponseSchema,
  });

  const country = response.data.objects[0];

  if (!country) {
    throw new Error(`Country not found: ${name}`);
  }

  return mapCountryV5ToDomain(country);
};
