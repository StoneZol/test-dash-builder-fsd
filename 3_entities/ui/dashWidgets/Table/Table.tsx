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
  dataQa = 'table',
}: TableProps) => {
  const isEmpty = !isLoading && !error && rows.length === 0;

  return (
    <article className={styles.root} data-qa={dataQa}>
      {onRefresh ? (
        <div className={styles.toolbar}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            dataQa={`${dataQa}-refresh`}
            onClick={onRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </div>
      ) : null}

      {isLoading ? (
        <p className={styles.state} data-qa={`${dataQa}-loading`}>
          Loading…
        </p>
      ) : null}
      {error ? (
        <p className={styles.error} data-qa={`${dataQa}-error`}>
          {error}
        </p>
      ) : null}
      {isEmpty ? (
        <p className={styles.state} data-qa={`${dataQa}-empty`}>
          {emptyMessage}
        </p>
      ) : null}

      {!isLoading && !error && !isEmpty ? (
        <div className={styles.scroll} data-qa={`${dataQa}-scroll`}>
          <table className={styles.table} data-qa={`${dataQa}-grid`}>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>{column.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={String(row.cca3 ?? row.name ?? index)}
                  data-qa={`${dataQa}-row-${row.cca3 ?? index}`}
                >
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
