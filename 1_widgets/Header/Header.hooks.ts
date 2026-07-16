import { envConfig, featureConfig } from '@/4_shared/configs';

/**
 * Header meta: env label + optional debug strip from feature flags.
 */
export const useHeader = () => {
  const showProduction = envConfig.isProduction;
  const showDebugPanel = envConfig.enableDebugPanel;

  const debugText = showDebugPanel
    ? `debug · catalog API limit ${featureConfig.catalogLimit} · chart regions ${featureConfig.chartRegionsLimit ?? 'all'}`
    : null;

  return {
    showProduction,
    showDebugPanel,
    debugText,
  };
};
