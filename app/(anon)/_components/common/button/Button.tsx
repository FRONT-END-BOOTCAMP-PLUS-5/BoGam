'use client';

import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from '@/(anon)/_components/common/button/Button.module.css';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
  isLoading?: boolean;
};

export default function Button({
  children,
  className,
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const finalClassName = clsx(
    styles.button,
    styles[variant],
    fullWidth && styles.fullWidth,
    (isLoading || disabled) && styles.disabled,
    className
  );

  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      className={finalClassName}
      disabled={isLoading || disabled}
    >
      {isLoading ? '처리 중...' : children}
    </button>
  );
}
