//비밀번호 입력 필드로, 보기/숨기기 토글 버튼이 포함된 컴포넌트.

'use client';
import '@/globals.css';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { styles } from '@/(anon)/_components/common/forms/Forms.styles';

type Props = {
  id: string;
  placeholder?: string;
  error?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function PasswordInput({
  id,
  placeholder,
  error,
  ...rest
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className='relative'>
      <input
        id={id}
        name={rest.name}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        className={[
          styles.inputBase,
          error ? styles.inputError : '',
          'pr-10',
        ].join(' ')}
        autoComplete='new-password'
        {...rest}
      />
      {show ? (
        <button
          type='button'
          className={styles.eyeBtn}
          onClick={() => {
            setShow(false);
            console.log('얘 눌렀다');
          }}
          aria-label='비밀번호 가리기'
        >
          <EyeOff width={18} height={18} />
        </button>
      ) : (
        <button
          type='button'
          className={styles.eyeBtn}
          onClick={() => {
            setShow(true);
          }}
          aria-label='비밀번호 보여주기'
        >
          <Eye width={18} height={18} />
        </button>
      )}
    </div>
  );
}
