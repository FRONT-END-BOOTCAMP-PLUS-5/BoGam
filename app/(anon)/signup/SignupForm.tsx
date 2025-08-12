'use client';

import Field from '@/(anon)/_components/common/forms/Field';
import OtpInput from '@/(anon)/_components/common/forms/OtpInput';
import TextInput from '@/(anon)/_components/common/forms/TextInput';
import PasswordInput from '@/(anon)/_components/common/forms/PasswordInput';
import styles from '@/(anon)/_components/common/forms/Forms.module.css';

export default function SignupForm() {
  return (
    <form className={styles.formRow}>
      <Field id='name' label='이름'>
        <TextInput id='name' name='name' placeholder='홍길동' />
      </Field>

      <Field id='nickname' label='닉네임' hint='2~12자, 특수문자 제외'>
        <TextInput
          id='nickname'
          name='nickname'
          placeholder='별명'
          rightAddon={
            <button type='button' className={styles.addonButton}>
              중복확인
            </button>
          }
        />
      </Field>

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

      <Field id='password2' label='비밀번호 확인'>
        <PasswordInput id='password2' placeholder='비밀번호 확인' />
      </Field>

      <Field id='pin' label='핀번호' hint='인증서 간편 비밀번호'>
        <OtpInput length={4} onChange={(v) => console.log('OTP', v)} />
      </Field>

      <Field id='phone' label='전화번호'>
        <TextInput
          id='phone'
          name='phone'
          inputMode='numeric'
          placeholder='010-1234-5678'
        />
      </Field>
    </form>
  );
}
