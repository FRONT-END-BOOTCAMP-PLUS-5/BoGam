import React from 'react';
import styles from './List.styles';

interface ListProps {
  data: Record<string, string>;
}

const List = ({ data }: ListProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        List 컴포넌트 - data: {JSON.stringify(data)}
      </div>
    </div>
  );
};

export default List;
