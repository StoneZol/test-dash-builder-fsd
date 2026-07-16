import { makeRequest, parseSchema, readResponseBody } from '@/4_shared/api';
import { serverEnvConfig } from '@/4_shared/configs/serverEnvConfig';
import {
  countriesV5ResponseSchema,
  type CountryCatalogItem,
} from '@/3_entities/models/country';

/** Light fields for select options — no translations / heavy nested blobs. */
const CATALOG_FIELDS = [
  'names.common',
  'codes.alpha_3',
  'region',
  'population',
].join(',');

const DEFAULT_CATALOG_SIZE = 100;
const PAGE_SIZE = 100;
const MAX_OFFSET = 500;

const buildUpstreamListUrl = (query: Record<string, string>) => {
  const base = serverEnvConfig.restCountriesApiBaseUrl.replace(/\/$/, '');
  const params = new URLSearchParams({
    response_fields: CATALOG_FIELDS,
    ...query,
  });

  return `${base}?${params.toString()}`;
};

type CatalogRow = CountryCatalogItem & { population: number };

type FetchCountriesCatalogOptions = {
  /** Max countries to return after sort-by-population (dev: 5, prod: 100). */
  limit?: number;
};

/**
 * Server-only: paginate a light field set, sort by population, return top-N
 * catalog entries (name + alpha-3 + region) for widget selects.
 */
export const fetchCountriesCatalog = async (
  options: FetchCountriesCatalogOptions = {},
): Promise<CountryCatalogItem[]> => {
  const limit = Math.min(
    Math.max(options.limit ?? DEFAULT_CATALOG_SIZE, 1),
    DEFAULT_CATALOG_SIZE,
  );

  let offset = 0;
  let more = true;
  const collected: CatalogRow[] = [];

  while (more) {
    const response = await makeRequest(
      buildUpstreamListUrl({
        limit: String(PAGE_SIZE),
        offset: String(offset),
      }),
      {
        token: serverEnvConfig.apiKey,
        cache: 'no-store',
      },
    );

    const body = await readResponseBody(response);

    if (!response.ok) {
      throw new Error(
        `Upstream countries catalog failed with status ${response.status}`,
      );
    }

    const parsed = parseSchema(body, countriesV5ResponseSchema);

    if (!parsed.success) {
      throw new Error('Upstream countries catalog failed schema validation');
    }

    for (const item of parsed.data.data.objects) {
      collected.push({
        name: item.names.common,
        cca3: item.codes.alpha_3,
        region: item.region,
        population: item.population,
      });
    }

    more = Boolean(parsed.data.data.meta?.more);
    offset += PAGE_SIZE;

    if (parsed.data.data.objects.length === 0 || offset > MAX_OFFSET) {
      break;
    }
  }

  return collected
    .sort((a, b) => b.population - a.population)
    .slice(0, limit)
    .map(({ name, cca3, region }) => ({ name, cca3, region }));
};
