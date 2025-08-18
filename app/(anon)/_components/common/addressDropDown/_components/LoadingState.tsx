import React from 'react';
import { styles } from '../AddressDropDown.styles';

interface LoadingStateProps {
  title: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title,
  className = '',
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <span className={styles.headerTitle}>{title}</span>
          <div className={styles.placeholderText}>로딩 중...</div>
        </div>
      </div>
    </div>
  );
};
