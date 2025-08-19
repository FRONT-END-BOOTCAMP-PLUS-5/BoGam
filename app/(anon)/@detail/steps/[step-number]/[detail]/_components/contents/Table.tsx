import React from 'react';
import styles from './Table.styles';

interface TableColumn {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps {
  columns: TableColumn[];
  data: Record<string, string | number>[];
  showHeader?: boolean;
  striped?: boolean;
  bordered?: boolean;
  compact?: boolean;
  className?: string;
}

const Table = ({
  columns,
  data,
  showHeader = true,
  striped = false,
  bordered = false,
  compact = false,
  className
}: TableProps) => {
  return (
    <div className={`${styles.tableContainer} ${className || ''}`}>
      <table className={`${styles.table} ${bordered ? styles.bordered : ''} ${compact ? styles.compact : ''}`}>
        {showHeader && (
          <thead>
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className={styles.headerCell}
                  style={{ 
                    width: column.width,
                    textAlign: column.align || 'left'
                  }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex}
              className={`${styles.row} ${striped && rowIndex % 2 === 1 ? styles.striped : ''}`}
            >
              {columns.map((column) => (
                <td 
                  key={column.key}
                  className={styles.cell}
                  style={{ textAlign: column.align || 'left' }}
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
