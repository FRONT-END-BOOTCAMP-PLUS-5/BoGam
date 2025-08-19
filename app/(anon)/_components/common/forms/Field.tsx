// 폼 필드의 레이블, 힌트, 오류 메시지를 표시하고 내부에 입력 컴포넌트를 감싸는 래퍼 컴포넌트

'use client';
import '@/globals.css';
import { ReactNode } from 'react';
import { styles } from '@/(anon)/_components/common/forms/Forms.styles';

type FieldProps = {
  id: string;
  label?: string;
  required?: boolean; //필수값인가
  hint?: string; // 헬퍼 문구
  error?: string; // 오류 문구
  actionSlot?: ReactNode; // 레이블 우측 작은 액션(예: "가이드")
  children: ReactNode; // 실제 입력 컴포넌트
};

export default function Field({
  id,
  label,
  required = true, // ✅ 기본값 true
  hint,
  error,
  actionSlot,
  children,
}: FieldProps) {
  return (
    <div className={styles.field}>
      {(label || actionSlot) && (
        <div className={styles.labelRow}>
          {label && (
            <label htmlFor={id} className={styles.label}>
              {label}
              {required && <span className={styles.require}>*</span>}
            </label>
          )}
          {actionSlot && <div className={styles.action}>{actionSlot}</div>}
        </div>
      )}

      <div className={styles.control}>{children}</div>

      {error ? (
        <p className={styles.error} role='alert'>
          {error}
        </p>
      ) : hint ? (
        <p className={styles.helper}>{hint}</p>
      ) : null}
    </div>
  );
}
