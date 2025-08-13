// 기본 텍스트 입력 필드로, 오른쪽에 부가 버튼(예: 중복확인)이나 아이콘을 추가할 수 있는 컴포넌트.

'use client';
import '@/globals.css';
import { InputHTMLAttributes, ReactNode, useId, useState } from 'react';
import styles from '@/(anon)/_components/common/forms/Forms.module.css';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  rightAddon?: ReactNode; // 버튼/아이콘
  error?: boolean;
  mask?: 'phone'; // ⬅️ 추가: 전화번호 마스킹
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 11); // 최대 11자리
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export default function TextInput({
  rightAddon,
  error,
  className,
  mask,
  onChange,
  inputMode,
  maxLength,
  type,
  ...rest
}: Props) {
  const [focus, setFocus] = useState(false);
  const autoId = useId();
  const id = (rest.id as string | undefined) ?? autoId;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (mask === 'phone') {
      const formatted = formatPhone(e.target.value);
      // 입력값을 즉시 포맷해 반영
      if (formatted !== e.target.value) {
        e.target.value = formatted;
      }
    }
    onChange?.(e);
  };

  const finalClass = [
    styles.inputBase,
    focus ? styles.inputFocus : '',
    error ? styles.inputError : '',
    className || '',
    rightAddon ? 'pr-24' : '', // 오른쪽 버튼 자리
  ].join(' ');

  return (
    <>
      <input
        id={id}
        {...rest}
        type={type ?? (mask === 'phone' ? 'tel' : 'text')}
        inputMode={inputMode ?? (mask === 'phone' ? 'numeric' : undefined)}
        maxLength={maxLength ?? (mask === 'phone' ? 13 : undefined)} // 010-1234-5678
        className={finalClass}
        onChange={handleChange}
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
