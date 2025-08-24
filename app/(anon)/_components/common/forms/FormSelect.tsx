'use client';

import { SelectHTMLAttributes } from 'react';
import { styles } from './FormSelect.styles';

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export const FormSelect = ({
  hasError = false,
  className,
  ...props
}: FormSelectProps) => {
  return (
    <select
      className={`${styles.select} ${hasError ? styles.selectError : ''} ${
        className || ''
      }`}
      {...props}
    />
  );
};

