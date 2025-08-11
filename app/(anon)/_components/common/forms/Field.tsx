'use client';
import { ReactNode } from 'react';
import s from '@/(anon)/_components/common/forms/Forms.module.css';

type FieldProps = {
  id: string;
  label?: string;
  hint?: string; // 헬퍼 문구
  error?: string; // 오류 문구
  actionSlot?: ReactNode; // 레이블 우측 작은 액션(예: "가이드")
  children: ReactNode; // 실제 입력 컴포넌트
};

export default function Field({
  id,
  label,
  hint,
  error,
  actionSlot,
  children,
}: FieldProps) {
  return (
    <div className={s.field}>
      {(label || actionSlot) && (
        <div className={s.labelRow}>
          {label && (
            <label htmlFor={id} className={s.label}>
              {label}
            </label>
          )}
          {actionSlot && <div className={s.action}>{actionSlot}</div>}
        </div>
      )}

      <div className={s.control}>{children}</div>

      {error ? (
        <p className={s.error} role='alert'>
          {error}
        </p>
      ) : hint ? (
        <p className={s.helper}>{hint}</p>
      ) : null}
    </div>
  );
}
