import { requestWithSchema } from '@/4_shared/api';
import { envConfig, featureConfig } from '@/4_shared/configs';
import {
  countriesCatalogResponseSchema,
  countriesV5ResponseSchema,
  countryV5DetailResponseSchema,
  mapCountryV5DetailResponse,
  mapCountryV5ToDomain,
  type Country,
  type CountryCatalogItem,
} from '@/3_entities/models/country';

const DETAIL_FIELDS = [
  'names.common',
  'names.official',
  'codes.alpha_3',
  'population',
  'region',
  'capitals',
  'flag',
].join(',');

const REGION_FIELDS = [
  'names.common',
  'names.official',
  'codes.alpha_3',
  'population',
  'region',
  'capitals',
].join(',');

/** Build a URL against the Next.js countries proxy. */
const buildProxyUrl = (path = '', query: Record<string, string> = {}) => {
  const base = envConfig.appApiBaseUrl.replace(/\/$/, '');
  const pathname = path
    ? `${base}/countries/${path.replace(/^\//, '')}`
    : `${base}/countries`;
  const params = new URLSearchParams(query);
  const search = params.toString();

  return search ? `${pathname}?${search}` : pathname;
};

/**
 * Shared select catalog (light payload).
 * Limit comes from `featureConfig.catalogLimit` (dev: 5, prod: 100) — applied on the API.
 * Same resource → `countryKeys.catalog(limit)` → shared across widgets.
 */
export const getCountriesCatalog = async (): Promise<CountryCatalogItem[]> => {
  const limit = featureConfig.catalogLimit;
  const response = await requestWithSchema({
    url: buildProxyUrl('catalog', { limit: String(limit) }),
    schema: countriesCatalogResponseSchema,
  });

  return response.data;
};

/**
 * Single-country detail by ISO alpha-3 (`/codes.alpha_3/{code}`).
 * Used by Metric / News — separate query key per code.
 */
export const getCountryByAlpha3 = async (cca3: string): Promise<Country> => {
  const response = await requestWithSchema({
    url: buildProxyUrl(`codes.alpha_3/${encodeURIComponent(cca3)}`, {
      response_fields: DETAIL_FIELDS,
    }),
    schema: countryV5DetailResponseSchema,
  });

  return mapCountryV5DetailResponse(response);
};

/**
 * Countries in a region (`?region=`). Used by Chart — key per region.
 */
export const getCountriesByRegion = async (
  region: string,
): Promise<Country[]> => {
  const response = await requestWithSchema({
    url: buildProxyUrl('', {
      region,
      response_fields: REGION_FIELDS,
      limit: '100',
    }),
    schema: countriesV5ResponseSchema,
  });

  return response.data.objects.map(mapCountryV5ToDomain);
};
