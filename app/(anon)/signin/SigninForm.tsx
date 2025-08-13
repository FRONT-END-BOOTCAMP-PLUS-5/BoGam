'use client';

import Field from '@/(anon)/_components/common/forms/Field';
import Button from '@/(anon)/_components/common/button/Button';
import TextInput from '@/(anon)/_components/common/forms/TextInput';
import PasswordInput from '@/(anon)/_components/common/forms/PasswordInput';
import styles from '@/(anon)/_components/common/forms/Forms.module.css';

export default function SigninForm() {
  return (
    <form className={styles.formRow}>
      <Field id='email' label='아이디'>
        <TextInput
          id='email'
          name='email'
          type='email'
          placeholder='example@naver.com'
        />
      </Field>
      <Field
        id='password'
        label='비밀번호'
        hint='영문 대/소문자, 숫자, 특수문자 포함 8자 이상'
      >
        <PasswordInput id='password' placeholder='비밀번호' />
      </Field>
      <Button type='submit' fullWidth variant='primary'>
        로그인
      </Button>
      <Button variant='ghost' href='/signup' fullWidth>
        회원가입
      </Button>
    </form>
  );
}
