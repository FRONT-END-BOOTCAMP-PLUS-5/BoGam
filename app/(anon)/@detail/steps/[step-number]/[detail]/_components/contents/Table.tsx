import React from 'react';
import styles from './Table.styles';

interface TableProps {
  title?: string;
  data: Array<{
    left: string;
    right?: string;
  }>;
  emptyRows?: number;
}

const Table = ({ title = '제출 서류', data, emptyRows = 2 }: TableProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <table className={styles.table}>
        <tbody>
          {/* 데이터 행들 */}
          {data.map((row, index) => (
            <tr key={index} className={styles.tableRow}>
              <td className={`${styles.tableCell} ${styles.tableCellLeft}`}>
                {row.left}
              </td>
              <td className={`${styles.tableCell} ${styles.tableCellRight}`}>
                {row.right || ''}
              </td>
            </tr>
          ))}

          {/* 빈 행들 */}
          {Array.from({ length: emptyRows }, (_, index) => (
            <tr key={`empty-${index}`} className={styles.emptyRow}>
              <td className={`${styles.emptyCell} ${styles.emptyCellLeft}`}>
                &nbsp;
              </td>
              <td className={`${styles.emptyCell} ${styles.emptyCellRight}`}>
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
