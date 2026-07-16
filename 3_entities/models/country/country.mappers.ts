import type { Country } from './country.schema';

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

export const findCountryByName = (
  countries: Country[],
  name: string,
): Country | undefined =>
  countries.find((country) => country.name.common === name);

export const mapCountriesToSelectOptions = (
  countries: Country[],
): CountrySelectOption[] =>
  countries.map((country) => ({
    value: country.name.common,
    label: country.name.common,
  }));

export const mapCountriesToRegionOptions = (
  countries: Country[],
): CountrySelectOption[] =>
  [...new Set(countries.map((country) => country.region))]
    .sort((a, b) => a.localeCompare(b))
    .map((region) => ({
      value: region,
      label: region,
    }));

export const mapCountriesToTableRows = (
  countries: Country[],
  selectedNames: string[] = [],
): CountryTableRow[] => {
  const selected = new Set(selectedNames);
  const filtered =
    selected.size > 0
      ? countries.filter((country) => selected.has(country.name.common))
      : [];

  return [...filtered]
    .sort((a, b) => b.population - a.population)
    .map((country) => ({
      cca3: country.cca3,
      name: country.name.common,
      region: country.region,
      capital: country.capital[0] ?? '—',
      population: country.population.toLocaleString('en-US'),
    }));
};

export const mapCountriesToChartBars = (
  countries: Country[],
  selectedRegions: string[] = [],
): CountryChartBar[] => {
  if (selectedRegions.length === 0) {
    return [];
  }

  const allowed = new Set(selectedRegions);
  const byRegion = countries.reduce<Record<string, number>>((acc, country) => {
    if (!allowed.has(country.region)) {
      return acc;
    }

    acc[country.region] = (acc[country.region] ?? 0) + country.population;
    return acc;
  }, {});

  return Object.entries(byRegion)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
};

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
