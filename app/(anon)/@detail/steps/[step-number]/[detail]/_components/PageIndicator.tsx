'use client';

import React from 'react';
import { styles } from './PageIndicator.styles';

interface PageIndicatorProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const PageIndicator = ({
  totalPages,
  currentPage,
  onPageChange,
}: PageIndicatorProps) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={styles.pageIndicator}>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index)}
          className={`${styles.pageDot} ${
            index === currentPage ? styles.pageDotActive : styles.pageDotInactive
          }`}
          aria-label={`페이지 ${index + 1}로 이동`}
        />
      ))}
    </div>
  );
};
