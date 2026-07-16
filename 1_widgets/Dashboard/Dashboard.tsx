'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, type RefObject } from 'react';
import {
    GridLayout,
    useContainerWidth,
    verticalCompactor,
    type Layout,
} from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import {
    ChartWidget,
    MetricWidget,
    NewsCardWidget,
    TableWidget,
} from '@/2_features/dashWidgets';
import {
    DASHBOARD_COLS,
    getCatalogItem,
    useDashboardStore,
    WIDGET_CATALOG,
    type WidgetInstance,
} from '@/2_features/dashboard';
import {
    countryKeys,
    useCountriesCatalogQuery,
} from '@/3_entities/api/country';
import { Button } from '@/4_shared/components/custom';

import styles from './Dashboard.module.scss';
import type { DashboardProps } from './Dashboard.types';

const COLS = DASHBOARD_COLS;

const getWidgetTitle = (widget: WidgetInstance) =>
    getCatalogItem(widget.type)?.title ?? widget.type;

type RenderWidgetArgs = {
    widget: WidgetInstance;
    onUpdateSettings: (
        id: string,
        settings: Partial<WidgetInstance['settings']>,
    ) => void;
};

const renderWidget = ({ widget, onUpdateSettings }: RenderWidgetArgs) => {
    switch (widget.type) {
        case 'table':
            return (
                <TableWidget
                    countryCodes={widget.settings.countryCodes ?? []}
                    onCountryCodesChange={(countryCodes) =>
                        onUpdateSettings(widget.id, { countryCodes })
                    }
                />
            );
        case 'metric':
            return (
                <MetricWidget
                    countryCode={widget.settings.countryCode}
                    onCountryChange={(countryCode) =>
                        onUpdateSettings(widget.id, { countryCode })
                    }
                />
            );
        case 'chart':
            return (
                <ChartWidget
                    regions={widget.settings.regions ?? []}
                    onRegionsChange={(regions) =>
                        onUpdateSettings(widget.id, { regions })
                    }
                />
            );
        case 'news':
            return (
                <NewsCardWidget
                    countryCode={widget.settings.countryCode}
                    onCountryChange={(countryCode) =>
                        onUpdateSettings(widget.id, { countryCode })
                    }
                />
            );
        default:
            return null;
    }
};

const Dashboard = ({}: DashboardProps) => {
    const queryClient = useQueryClient();
    const { width, containerRef, mounted, measureWidth } = useContainerWidth({
        measureBeforeMount: true,
    });
    const [hydrated, setHydrated] = useState(false);

    const widgets = useDashboardStore((state) => state.widgets);
    // Shared light catalog only when widgets exist
    useCountriesCatalogQuery({ enabled: widgets.length > 0 });
    const layout = useDashboardStore((state) => state.layout);
    const addWidget = useDashboardStore((state) => state.addWidget);
    const removeWidget = useDashboardStore((state) => state.removeWidget);
    const setLayout = useDashboardStore((state) => state.setLayout);
    const updateWidgetSettings = useDashboardStore(
        (state) => state.updateWidgetSettings,
    );

    useEffect(() => {
        const result = useDashboardStore.persist.rehydrate();
        Promise.resolve(result).finally(() => {
            setHydrated(true);
        });
    }, []);

    // Ref появляется только после hydrate — нужно перезамерить ширину
    useEffect(() => {
        if (!hydrated) return;
        measureWidth();
    }, [hydrated, measureWidth, widgets.length]);

    const handleLayoutChange = (nextLayout: Layout) => {
        setLayout(
            nextLayout.map((item) => ({
                i: item.i,
                x: item.x,
                y: item.y,
                w: item.w,
                h: item.h,
                minW: item.minW,
                minH: item.minH,
            })),
        );
    };

    if (!hydrated) {
        return (
            <section className={styles.root} data-qa="dashboard-hydrating">
                <p className={styles.hint}>Restoring dashboard…</p>
            </section>
        );
    }

    return (
        <section className={styles.root} data-qa="dashboard">
            <header className={styles.toolbar} data-qa="dashboard-toolbar">
                <div>
                    <h1 className={styles.heading}>Dashboard Builder</h1>
                    <p className={styles.hint}>
                        Add widgets, drag to rearrange. Config is saved in local
                        storage.
                    </p>
                </div>
                <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    dataQa="dashboard-invalidate-cache"
                    onClick={() => {
                        void queryClient.invalidateQueries({
                            queryKey: countryKeys.all,
                        });
                    }}
                >
                    Invalidate countries cache
                </Button>
            </header>

            <div className={styles.catalog} data-qa="dashboard-catalog">
                {WIDGET_CATALOG.map((item) => (
                    <button
                        key={item.type}
                        type="button"
                        className={styles.catalogItem}
                        data-qa={`dashboard-catalog-item-${item.type}`}
                        onClick={() => addWidget(item.type)}
                    >
                        <span className={styles.catalogBadge}>{item.type}</span>
                        <span className={styles.catalogTitle}>{item.title}</span>
                        <span className={styles.catalogDescription}>
                            {item.description}
                        </span>
                    </button>
                ))}
            </div>

            {/* Контейнер всегда в DOM — иначе useContainerWidth не замерит ширину */}
            <div
                ref={containerRef as RefObject<HTMLDivElement>}
                className={styles.gridWrap}
                data-qa="dashboard-grid-wrap"
            >
                {widgets.length === 0 ? (
                    <p className={styles.empty} data-qa="dashboard-empty">
                        No widgets yet. Pick one from the catalog above.
                    </p>
                ) : mounted ? (
                    <GridLayout
                        className={styles.grid}
                        width={width}
                        layout={layout}
                        compactor={verticalCompactor}
                        gridConfig={{
                            cols: COLS,
                            rowHeight: 36,
                            margin: [16, 16],
                            containerPadding: [0, 0],
                        }}
                        dragConfig={{
                            handle: `.${styles.dragHandle}`,
                        }}
                        resizeConfig={{ enabled: true }}
                        onLayoutChange={handleLayoutChange}
                    >
                        {widgets.map((widget) => (
                            <div
                                key={widget.id}
                                className={styles.item}
                                data-qa={`dashboard-widget-${widget.type}`}
                                data-widget-id={widget.id}
                            >
                                <div
                                    className={styles.itemChrome}
                                    data-qa="dashboard-widget-chrome"
                                >
                                    <button
                                        type="button"
                                        className={styles.dragHandle}
                                        aria-label="Drag widget"
                                        data-qa="dashboard-widget-drag"
                                    >
                                        ⋮⋮
                                    </button>
                                    <h3 className={styles.itemTitle}>
                                        {getWidgetTitle(widget)}
                                    </h3>
                                    <Button
                                        type="button"
                                        variant="danger"
                                        size="sm"
                                        dataQa="dashboard-widget-remove"
                                        onClick={() => removeWidget(widget.id)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                                <div
                                    className={styles.itemBody}
                                    data-qa="dashboard-widget-body"
                                >
                                    {renderWidget({
                                        widget,
                                        onUpdateSettings: updateWidgetSettings,
                                    })}
                                </div>
                            </div>
                        ))}
                    </GridLayout>
                ) : (
                    <p className={styles.hint} data-qa="dashboard-grid-preparing">
                        Preparing grid…
                    </p>
                )}
            </div>
        </section>
    );
};

export default Dashboard;
