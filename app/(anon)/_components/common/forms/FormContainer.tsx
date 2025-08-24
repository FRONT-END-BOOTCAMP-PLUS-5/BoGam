'use client';

import { ReactNode } from 'react';
import { styles } from '@/(anon)/_components/common/forms/FormContainer.styles';
import Button from '../button/Button';

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
  submitText = '발급 받기',
  disabled = false,
}: FormContainerProps) => {
  return (
    <div className={styles.container}>
      {title && <h2 className={styles.title}>{title}</h2>}

      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.formContent}>{children}</div>

        <div className={styles.buttonContainer}>
          <Button
            type='submit'
            variant='primary'
            fullWidth
            disabled={disabled || isLoading}
            isLoading={isLoading}
          >
            {isLoading ? '처리 중...' : submitText}
          </Button>
        </div>
      </form>
    </div>
  );
};
