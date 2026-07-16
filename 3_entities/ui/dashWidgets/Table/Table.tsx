import styles from './Table.module.scss';
import type { TableProps } from './Table.types';

const Table = ({
    columns,
    rows,
    isLoading = false,
    error = null,
    onRefresh,
}: TableProps) => {
    return (
        <article className={styles.root}>
            {onRefresh ? (
                <div className={styles.toolbar}>
                    <button
                        type="button"
                        className={styles.refresh}
                        onClick={onRefresh}
                        disabled={isLoading}
                    >
                        Refresh
                    </button>
                </div>
            ) : null}

            {isLoading ? <p className={styles.state}>Loading…</p> : null}
            {error ? <p className={styles.error}>{error}</p> : null}

            {!isLoading && !error ? (
                <div className={styles.scroll}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                {columns.map((column) => (
                                    <th key={column.key}>{column.title}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={String(row.cca3 ?? row.name ?? index)}>
                                    {columns.map((column) => (
                                        <td key={column.key}>{row[column.key]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : null}
        </article>
    );
};

export default Table;
