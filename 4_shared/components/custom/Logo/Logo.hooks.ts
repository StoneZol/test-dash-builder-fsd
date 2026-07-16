import { envConfig } from '@/4_shared/configs';

type UseLogoArgs = {
    title: string;
};

/**
 * Logo display title + Dev badge from env.
 */
export const useLogo = ({ title }: UseLogoArgs) => {
    const isDev = envConfig.isDevelopment;
    const displayTitle = isDev ? `${title} Dev` : title;

    return {
        isDev,
        displayTitle,
    };
};
