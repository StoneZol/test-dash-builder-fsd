import { envConfig, featureConfig } from '@/4_shared/configs';

const formatLimit = (limit: number | null) =>
    limit == null ? 'all' : String(limit);

/**
 * Header meta: env label + optional debug strip from feature flags.
 */
export const useHeader = () => {
    const showProduction = envConfig.isProduction;
    const showDebugPanel = envConfig.enableDebugPanel;

    const debugText = showDebugPanel
        ? `debug · light catalog top 100 · spotlight ${formatLimit(featureConfig.spotlightCountriesLimit)} · table ${formatLimit(featureConfig.tableCountriesLimit)} · regions ${formatLimit(featureConfig.chartRegionsLimit)}`
        : null;

    return {
        showProduction,
        showDebugPanel,
        debugText,
    };
};
