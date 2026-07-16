export const countryKeys = {
  all: ['countries'] as const,
  table: () => [...countryKeys.all, 'table'] as const,
  chart: () => [...countryKeys.all, 'chart'] as const,
  details: () => [...countryKeys.all, 'detail'] as const,
  byName: (name: string) => [...countryKeys.details(), 'byName', name] as const,
};
