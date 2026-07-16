const getRequiredEnv = (key: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const envConfig = {
  appEnv: process.env.NEXT_PUBLIC_APP_ENV ?? 'development',
  apiBaseUrl: getRequiredEnv(
    'NEXT_PUBLIC_API_BASE_URL',
    process.env.NEXT_PUBLIC_API_BASE_URL,
  ),
  enableDebugPanel: process.env.NEXT_PUBLIC_ENABLE_DEBUG_PANEL === 'true',
  apiKey: process.env.API_KEY ?? '',
  isDevelopment: process.env.NEXT_PUBLIC_APP_ENV === 'development',
  isProduction: process.env.NEXT_PUBLIC_APP_ENV === 'production',
} as const;

export type AppEnv = typeof envConfig.appEnv;
