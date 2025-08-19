import React from 'react';
import { styles } from '../AddressDropDown.styles';

interface AuthRequiredStateProps {
  title: string;
  className?: string;
}

export const AuthRequiredState: React.FC<AuthRequiredStateProps> = ({
  title,
  className = '',
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <span className={styles.headerTitle}>{title}</span>
          <div className={styles.placeholderText}>로그인이 필요합니다.</div>
        </div>
      </div>
    </div>
  );
};
