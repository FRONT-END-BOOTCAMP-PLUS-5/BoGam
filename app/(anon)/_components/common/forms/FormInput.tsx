'use client';

import { InputHTMLAttributes } from 'react';
import { styles } from './FormInput.styles';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const FormInput = ({
  hasError = false,
  className,
  ...props
}: FormInputProps) => {
  return (
    <input
      className={`${styles.input} ${hasError ? styles.inputError : ''} ${
        className || ''
      }`}
      {...props}
    />
  );
};

