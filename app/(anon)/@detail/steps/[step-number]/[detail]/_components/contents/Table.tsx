import React from 'react';
import styles from './Table.styles';

interface TableProps {
  title?: string;
  data: Array<{
    left: string;
    center?: string;
    right?: string;
  }>;
  emptyRows?: number;
  columns?: 2 | 3;
}

const Table = ({ title = '제출 서류', data, emptyRows = 2, columns = 2 }: TableProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <table className={styles.table}>
        <tbody>
          {/* 데이터 행들 */}
          {data.map((row, index) => (
            <tr key={index} className={styles.tableRow}>
              <td className={`${styles.tableCell} ${columns === 3 ? styles.tableCellLeft3 : styles.tableCellLeft}`}>
                {row.left}
              </td>
              {columns === 3 && (
                <td className={`${styles.tableCell} ${styles.tableCellCenter}`}>
                  {row.center || ''}
                </td>
              )}
              <td className={`${styles.tableCell} ${columns === 3 ? styles.tableCellRight3 : styles.tableCellRight}`}>
                {row.right || ''}
              </td>
            </tr>
          ))}

          {/* 빈 행들 */}
          {Array.from({ length: emptyRows }, (_, index) => (
            <tr key={`empty-${index}`} className={styles.emptyRow}>
              <td className={`${styles.emptyCell} ${columns === 3 ? styles.emptyCellLeft3 : styles.emptyCellLeft}`}>
                &nbsp;
              </td>
              {columns === 3 && (
                <td className={`${styles.emptyCell} ${styles.emptyCellCenter}`}>
                  &nbsp;
                </td>
              )}
              <td className={`${styles.emptyCell} ${columns === 3 ? styles.emptyCellRight3 : styles.emptyCellRight}`}>
                &nbsp;
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;