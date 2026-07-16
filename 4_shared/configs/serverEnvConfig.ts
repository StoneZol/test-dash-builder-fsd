const getRequiredEnv = (key: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

/**
 * Server-only secrets / upstream URLs.
 * Import only from Route Handlers / Server Components.
 * Do not re-export this from the client-facing configs barrel.
 */
export const serverEnvConfig = {
  restCountriesApiBaseUrl: getRequiredEnv(
    'REST_COUNTRIES_API_BASE_URL',
    process.env.REST_COUNTRIES_API_BASE_URL,
  ),
  apiKey: getRequiredEnv('API_KEY', process.env.API_KEY),
} as const;
