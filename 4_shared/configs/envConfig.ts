/** Safe for client + server. Never put secrets here. */
export const envConfig = {
  appEnv: process.env.NEXT_PUBLIC_APP_ENV ?? 'development',
  appApiBaseUrl: process.env.NEXT_PUBLIC_APP_API_BASE_URL ?? '/api',
  enableDebugPanel: process.env.NEXT_PUBLIC_ENABLE_DEBUG_PANEL === 'true',
  isDevelopment: process.env.NEXT_PUBLIC_APP_ENV === 'development',
  isProduction: process.env.NEXT_PUBLIC_APP_ENV === 'production',
} as const;

export type AppEnv = typeof envConfig.appEnv;
