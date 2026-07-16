import type { Country, CountryCatalogItem } from './country.schema';

export type CountrySelectOption = {
  value: string;
  label: string;
};

export type CountryTableRow = {
  cca3: string;
  name: string;
  region: string;
  capital: string;
  population: string;
};

export type CountryChartBar = {
  label: string;
  value: number;
};

export type CountryMetricView = {
  value: string;
  description: string;
};

export type CountryNewsView = {
  title: string;
  subtitle: string;
  body: string;
  imageUrl?: string;
  imageAlt?: string;
};

export const findCountryByCode = (
  countries: Country[],
  cca3: string,
): Country | undefined =>
  countries.find((country) => country.cca3 === cca3);

/** Select options: value is ISO alpha-3 for stable detail/list queries. */
export const mapCatalogToSelectOptions = (
  catalog: CountryCatalogItem[],
): CountrySelectOption[] =>
  catalog.map((item) => ({
    value: item.cca3,
    label: item.name,
  }));

export const mapCatalogToRegionOptions = (
  catalog: CountryCatalogItem[],
): CountrySelectOption[] =>
  [...new Set(catalog.map((item) => item.region).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b))
    .map((region) => ({
      value: region,
      label: region,
    }));

export const mapCountriesToTableRows = (
  countries: Country[],
): CountryTableRow[] =>
  [...countries]
    .sort((a, b) => b.population - a.population)
    .map((country) => ({
      cca3: country.cca3,
      name: country.name.common,
      region: country.region,
      capital: country.capital[0] ?? '—',
      population: country.population.toLocaleString('en-US'),
    }));

export const mapCountriesToChartBars = (
  countriesByRegion: Array<{ region: string; countries: Country[] }>,
): CountryChartBar[] =>
  countriesByRegion
    .map(({ region, countries }) => ({
      label: region,
      value: countries.reduce((sum, country) => sum + country.population, 0),
    }))
    .filter((bar) => bar.value > 0)
    .sort((a, b) => b.value - a.value);

export const mapCountryToMetricView = (country: Country): CountryMetricView => ({
  value: country.population.toLocaleString('en-US'),
  description: `${country.name.common} · ${country.region}`,
});

export const mapCountryToNewsView = (country: Country): CountryNewsView => {
  const capital = country.capital[0] ?? 'unknown capital';

  return {
    title: country.name.common,
    subtitle: `${country.region} · ${country.cca3}`,
    body: `${country.name.official} — capital ${capital}, population ${country.population.toLocaleString('en-US')}.`,
    imageUrl: country.flags?.png,
    imageAlt: country.flags?.alt ?? country.name.common,
  };
};
