import React from 'react';
import styles from './List.styles';

interface ListProps {
  data: { left: string; right?: string }[];
}

const List = ({ data }: ListProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {data.map((item, index) => (
          <div
            key={index}
            className='flex justify-between items-center py-2 border-b border-gray-200'
          >
            <span className='font-medium'>{item.left}</span>
            {item.right && <span className='text-gray-600'>{item.right}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
