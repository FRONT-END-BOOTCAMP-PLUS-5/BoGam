// 기본 텍스트 입력 필드로, 오른쪽에 부가 버튼(예: 중복확인)이나 아이콘을 추가할 수 있는 컴포넌트.

'use client';
import '@/globals.css';
import { InputHTMLAttributes, ReactNode, useId, useState } from 'react';
import styles from '@/(anon)/_components/common/forms/Forms.module.css';

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
  const autoId = useId();
  const id = (rest.id as string | undefined) ?? autoId;

  return (
    <>
      <input
        id={id}
        {...rest}
        className={[
          styles.inputBase,
          focus ? styles.inputFocus : '',
          error ? styles.inputError : '',
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
      {rightAddon && <div className={styles.addonRight}>{rightAddon}</div>}
    </>
  );
}
