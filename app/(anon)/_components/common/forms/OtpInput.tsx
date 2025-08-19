// OTP(인증서 간편 비밀번호) 입력용으로, 한 자리씩 입력받아 자동 포커스 이동과 삭제 시 이전 필드로 이동 기능을 제공.

'use client';

import '@/globals.css';
import { useRef, useCallback } from 'react';
import styles from '@/(anon)/_components/common/forms/Forms.module.css';

export default function OtpInput({
  length = 4,
  onChange,
}: {
  length?: number;
  onChange?: (value: string) => void;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const setRef = useCallback(
    (idx: number) => (el: HTMLInputElement | null) => {
      // 반환값 없음 → void
      refs.current[idx] = el;
    },
    []
  );

  const handle = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 1);
    e.target.value = v;
    if (v && idx < length - 1) refs.current[idx + 1]?.focus();
    const value = refs.current.map((r) => r?.value ?? '').join('');
    onChange?.(value);
  };

  const onKey = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'Backspace' &&
      !(e.target as HTMLInputElement).value &&
      idx > 0
    ) {
      refs.current[idx - 1]?.focus();
    }
  };

  return (
    <div className={styles.otpRow}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={setRef(i)}
          type='password'
          inputMode='numeric'
          pattern='\d*'
          maxLength={1}
          className={styles.otpBox}
          onChange={(e) => handle(i, e)}
          onKeyDown={(e) => onKey(i, e)}
          aria-label={`인증번호 ${i + 1}자리`}
        />
      ))}
    </div>
  );
}
