'use client';

import { ReactNode } from 'react';
import { styles } from '@/(anon)/_components/common/forms/FormContainer.styles';

interface FormContainerProps {
  title?: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  submitText?: string;
  disabled?: boolean;
}

export const FormContainer = ({
  title,
  children,
  onSubmit,
  isLoading = false,
  submitText = '제출',
  disabled = false,
}: FormContainerProps) => {
  return (
    <div className={styles.container}>
      {title && <h2 className={styles.title}>{title}</h2>}

      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.formContent}>{children}</div>

        <div className={styles.buttonContainer}>
          <button
            type='submit'
            disabled={disabled || isLoading}
            className={styles.submitButton}
          >
            {isLoading ? '처리 중...' : submitText}
          </button>
        </div>
      </form>
    </div>
  );
};
