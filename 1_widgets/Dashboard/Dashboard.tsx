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
    getCatalogItem,
    useDashboardStore,
    WIDGET_CATALOG,
    type WidgetInstance,
} from '@/2_features/dashboard';
import { countryKeys } from '@/3_entities/api/country';

import styles from './Dashboard.module.scss';
import type { DashboardProps } from './Dashboard.types';

const COLS = 12;

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
                    countryNames={widget.settings.countryNames ?? []}
                    onCountryNamesChange={(countryNames) =>
                        onUpdateSettings(widget.id, { countryNames })
                    }
                />
            );
        case 'metric':
            return (
                <MetricWidget
                    countryName={widget.settings.countryName}
                    onCountryChange={(countryName) =>
                        onUpdateSettings(widget.id, { countryName })
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
                    countryName={widget.settings.countryName}
                    onCountryChange={(countryName) =>
                        onUpdateSettings(widget.id, { countryName })
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
            <section className={styles.root}>
                <p className={styles.hint}>Restoring dashboard…</p>
            </section>
        );
    }

    return (
        <section className={styles.root}>
            <header className={styles.toolbar}>
                <div>
                    <h1 className={styles.heading}>Dashboard Builder</h1>
                    <p className={styles.hint}>
                        Add widgets, drag to rearrange. Config is saved in local
                        storage.
                    </p>
                </div>
                <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => {
                        void queryClient.invalidateQueries({
                            queryKey: countryKeys.all,
                        });
                    }}
                >
                    Invalidate countries cache
                </button>
            </header>

            <div className={styles.catalog}>
                {WIDGET_CATALOG.map((item) => (
                    <button
                        key={item.type}
                        type="button"
                        className={styles.catalogItem}
                        onClick={() => addWidget(item.type)}
                    >
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
            >
                {widgets.length === 0 ? (
                    <p className={styles.empty}>
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
                            <div key={widget.id} className={styles.item}>
                                <div className={styles.itemChrome}>
                                    <button
                                        type="button"
                                        className={styles.dragHandle}
                                        aria-label="Drag widget"
                                    >
                                        ⋮⋮
                                    </button>
                                    <h3 className={styles.itemTitle}>
                                        {getWidgetTitle(widget)}
                                    </h3>
                                    <button
                                        type="button"
                                        className={styles.remove}
                                        onClick={() => removeWidget(widget.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                                <div className={styles.itemBody}>
                                    {renderWidget({
                                        widget,
                                        onUpdateSettings: updateWidgetSettings,
                                    })}
                                </div>
                            </div>
                        ))}
                    </GridLayout>
                ) : (
                    <p className={styles.hint}>Preparing grid…</p>
                )}
            </div>
        </section>
    );
};

export default Dashboard;
