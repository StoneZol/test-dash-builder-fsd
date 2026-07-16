export const countryKeys = {
  all: ['countries'] as const,
  /** Shared ~100 countries dataset used by all widgets */
  dataset: () => [...countryKeys.all, 'dataset'] as const,
  details: () => [...countryKeys.all, 'detail'] as const,
  byName: (name: string) => [...countryKeys.details(), 'byName', name] as const,
};
