'use client';
import '@/styles/globals.css';
import { useState } from 'react';
import s from '@/(anon)/_components/common/forms/Forms.module.css';

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
        className={[s.inputBase, error ? s.inputError : '', 'pr-10'].join(' ')}
        autoComplete='new-password'
      />
      <button
        type='button'
        className={s.eyeBtn}
        onClick={() => setShow((v) => !v)}
        aria-label={show ? '비밀번호 숨기기' : '비밀번호 보기'}
      >
        {show ? '🙈' : '👁️'}
      </button>
    </div>
  );
}
