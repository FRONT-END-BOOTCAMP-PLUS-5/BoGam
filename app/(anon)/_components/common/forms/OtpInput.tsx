'use client';
import { useRef } from 'react';
import s from '@/(anon)/_components/common/forms/Forms.module.css';

export default function OtpInput({
  length = 6,
  onChange,
}: {
  length?: number;
  onChange?: (value: string) => void;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

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
    <div className={s.otpRow}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          inputMode='numeric'
          pattern='\d*'
          maxLength={1}
          className={s.otpBox}
          onChange={(e) => handle(i, e)}
          onKeyDown={(e) => onKey(i, e)}
          aria-label={`인증번호 ${i + 1}자리`}
        />
      ))}
    </div>
  );
}
