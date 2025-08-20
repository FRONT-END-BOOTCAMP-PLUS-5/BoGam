import React from 'react';
import styles from './Table.styles';

interface TableProps {
  data: Record<string, string>;
}

const Table = ({ data }: TableProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        Table 컴포넌트 - data: {JSON.stringify(data)}
      </div>
    </div>
  );
};

export default Table;
