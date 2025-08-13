'use client';

import Link, { LinkProps } from 'next/link';
import { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from '@/(anon)/_components/common/button/Button.module.css';

type CommonProps = {
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined; // href 없으면 실제 button
  };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> &
  Pick<LinkProps, 'replace' | 'scroll' | 'prefetch'> & {
    href: string; // href 있으면 Link(<a>)
    type?: never; // a 태그에는 type 불가
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

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

  // href가 있으면 Link(<a>)로 렌더링
  if ('href' in props && props.href) {
    const { href, replace, scroll, prefetch, ...rest } = props;

    return (
      <Link
        href={href}
        replace={replace}
        scroll={scroll}
        prefetch={prefetch}
        // disabled는 DOM에 넘기지 않음
        className={clsx(
          finalClassName,
          (isLoading || disabled) && 'pointer-events-none'
        )}
        aria-disabled={isLoading || disabled || undefined}
        {...rest}
      >
        {isLoading ? '처리 중...' : children}
      </Link>
    );
  }

  // 기본 button 렌더링
  const buttonProps = props as ButtonAsButton;

  return (
    <button
      {...buttonProps}
      type={buttonProps.type ?? 'button'}
      className={finalClassName}
      disabled={isLoading || disabled}
    >
      {isLoading ? '처리 중...' : children}
    </button>
  );
}
