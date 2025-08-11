'use client';
import '@/globals.css';
import { InputHTMLAttributes, ReactNode, useId, useState } from 'react';
import s from '@/(anon)/_components/common/forms/Forms.module.css';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  rightAddon?: ReactNode; // 버튼/아이콘
  error?: boolean;
};

export default function TextInput({
  rightAddon,
  error,
  className,
  ...rest
}: Props) {
  const [focus, setFocus] = useState(false);
  const id = rest.id || useId();

  return (
    <>
      <input
        id={id}
        {...rest}
        className={[
          s.inputBase,
          focus ? s.inputFocus : '',
          error ? s.inputError : '',
          className || '',
          rightAddon ? 'pr-24' : '', // 오른쪽 버튼 자리
        ].join(' ')}
        onFocus={(e) => {
          setFocus(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocus(false);
          rest.onBlur?.(e);
        }}
      />
      {rightAddon && <div className={s.addonRight}>{rightAddon}</div>}
    </>
  );
}
