'use client';

import Field from '@/(anon)/_components/common/forms/Field';
import TextInput from '@/(anon)/_components/common/forms/TextInput';
import PasswordInput from '@/(anon)/_components/common/forms/PasswordInput';
import OtpInput from '@/(anon)/_components/common/forms/OtpInput';
import s from '@/(anon)/_components/common/forms/Forms.module.css';

export default function SignupForm() {
  return (
    <form className={s.formRow}>
      <Field id='name' label='이름'>
        <TextInput id='name' placeholder='홍길동' />
      </Field>

      <Field id='nickname' label='닉네임' hint='2~12자, 특수문자 제외'>
        <TextInput
          id='nickname'
          placeholder='별명'
          rightAddon={<button className={s.addonButton}>중복확인</button>}
        />
      </Field>

      <Field id='email' label='아이디' error='이미 존재하는 아이디입니다.'>
        <TextInput id='email' type='email' placeholder='example@naver.com' />
      </Field>

      <Field
        id='password'
        label='비밀번호'
        hint='영문 대/소문자, 숫자, 특수문자 포함 8자 이상'
      >
        <PasswordInput id='password' placeholder='비밀번호' />
      </Field>

      <Field
        id='password2'
        label='비밀번호 확인'
        error='비밀번호가 일치하지 않습니다.'
      >
        <PasswordInput id='password2' placeholder='비밀번호 확인' />
      </Field>

      <Field id='pin' label='핀번호' hint='인증서 간편 비밀번호'>
        <OtpInput length={4} onChange={(v) => console.log('OTP', v)} />
      </Field>

      <Field id='phone' label='전화번호'>
        <TextInput id='phone' inputMode='numeric' placeholder='010-1234-5678' />
      </Field>
    </form>
  );
}
