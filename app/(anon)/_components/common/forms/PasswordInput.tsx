//비밀번호 입력 필드로, 보기/숨기기 토글 버튼이 포함된 컴포넌트.

'use client';
import '@/globals.css';
import { useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';
import styles from '@/(anon)/_components/common/forms/Forms.module.css';

type Props = {
  id: string;
  placeholder?: string;
  error?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export default function PasswordInput({
  id,
  placeholder,
  error,
  onChange,
}: Props) {
  const [show, setShow] = useState(false);
  return (
    <div className='relative'>
      <input
        id={id}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        onChange={onChange}
        className={[
          styles.inputBase,
          error ? styles.inputError : '',
          'pr-10',
        ].join(' ')}
        autoComplete='new-password'
      />
      <button
        type='button'
        className={styles.eyeBtn}
        onClick={() => setShow((v) => !v)}
        aria-label={show ? '비밀번호 숨기기' : '비밀번호 보기'}
      >
        {show ? (
          <EyeClosed width={18} height={18} />
        ) : (
          <Eye width={18} height={18} />
        )}
      </button>
    </div>
  );
}
