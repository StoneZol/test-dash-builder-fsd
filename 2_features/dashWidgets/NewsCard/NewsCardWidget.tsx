'use client';

import { NewsCard } from '@/3_entities/ui/dashWidgets';
import { Select } from '@/4_shared/components/custom';

import styles from './NewsCardWidget.module.scss';
import { useNewsCardWidget } from './NewsCardWidget.hooks';

type NewsCardWidgetProps = {
    countryCode?: string;
    onCountryChange: (countryCode: string) => void;
};

export const NewsCardWidget = ({
    countryCode = '',
    onCountryChange,
}: NewsCardWidgetProps) => {
    const {
        options,
        news,
        isLoading,
        error,
        selectLabel,
        isSelectDisabled,
        onRefresh,
    } = useNewsCardWidget({ countryCode, onCountryChange });

    return (
        <div className={styles.root} data-qa="feature-news-widget">
            <Select
                label={selectLabel}
                value={countryCode}
                options={options}
                disabled={isSelectDisabled}
                dataQa="feature-news-country-select"
                onChange={onCountryChange}
            />
            <NewsCard
                title={news?.title ?? 'Country'}
                subtitle={news?.subtitle}
                body={news?.body ?? 'Country briefing'}
                imageUrl={news?.imageUrl}
                imageAlt={news?.imageAlt}
                isLoading={isLoading}
                error={error}
                onRefresh={onRefresh}
                dataQa="entity-news-card"
            />
        </div>
    );
};
