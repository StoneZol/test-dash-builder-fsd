import { Button } from '@/4_shared/components/custom';

import styles from './Table.module.scss';
import type { TableProps } from './Table.types';

const Table = ({
  columns,
  rows,
  isLoading = false,
  error = null,
  emptyMessage = 'Nothing to show',
  onRefresh,
}: TableProps) => {
  const isEmpty = !isLoading && !error && rows.length === 0;

  return (
    <article className={styles.root}>
      {onRefresh ? (
        <div className={styles.toolbar}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </div>
      ) : null}

      {isLoading ? <p className={styles.state}>Loading…</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}
      {isEmpty ? <p className={styles.state}>{emptyMessage}</p> : null}

      {!isLoading && !error && !isEmpty ? (
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
