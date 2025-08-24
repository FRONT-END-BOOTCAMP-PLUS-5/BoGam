'use client';

import { ReactNode } from 'react';
import { styles } from './FormField.styles';

interface FormFieldProps {
  label: string;
  children: ReactNode;
  required?: boolean;
  error?: string;
  helpText?: string;
}

export const FormField = ({
  label,
  children,
  required = false,
  error,
  helpText,
}: FormFieldProps) => {
  return (
    <div className={styles.fieldContainer}>
      <label className={required ? styles.requiredLabel : styles.label}>
        {label}
      </label>
      {children}
      {error && <p className={styles.errorMessage}>{error}</p>}
      {helpText && <p className={styles.helpText}>{helpText}</p>}
    </div>
  );
};

