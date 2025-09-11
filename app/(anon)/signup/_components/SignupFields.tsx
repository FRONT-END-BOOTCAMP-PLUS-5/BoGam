'use client';

import { UseFormReturn } from 'react-hook-form';
import { SignupInput } from './schema';
import Field from '@/(anon)/_components/common/forms/Field';
import TextInput from '@/(anon)/_components/common/forms/TextInput';
import PasswordInput from '@/(anon)/_components/common/forms/PasswordInput';
import OtpInput from '@/(anon)/_components/common/forms/OtpInput';
import { styles } from '@/(anon)/_components/common/forms/Forms.styles';
import { useState } from 'react';
import { useCheckNickname } from '@/hooks/useCheckNickname';

interface Props {
  form: UseFormReturn<SignupInput>;
}

export function SignupFields({ form }: Props) {
  const {
    register,
    watch,
    setValue,
    clearErrors,
    trigger,
    formState: { errors },
  } = form;

  const nickname = watch('nickname');
  const [triggerCheck, setTriggerCheck] = useState(false);

  const { data, isFetching, isError, isSuccess, refetch } = useCheckNickname(
    nickname,
    triggerCheck
  );

  const available = data?.available ?? false;

  return (
    <>
      <Field id='name' label='이름'>
        <TextInput
          id='name'
          {...register('name')}
          placeholder='홍길동'
          onChange={() => clearErrors('name')}
        />
        {errors.name && <p className={styles.error}>{errors.name.message}</p>}
      </Field>

      <Field id='nickname' label='닉네임' hint='2글자 이상 입력하세요.'>
        <TextInput
          id='nickname'
          {...register('nickname')}
          placeholder='별명'
          rightAddon={
            <button
              type='button'
              className={
                available ? styles.addonRightDisabled : styles.addonRight
              }
              onClick={() => {
                setTriggerCheck(true);
                refetch();
              }}
              disabled={available}
            >
              {isFetching ? '확인 중' : available ? '확인완료' : '중복확인'}
            </button>
          }
          onChange={() => {
            setTriggerCheck(false);
            clearErrors('nickname');
          }}
        />
        {isError && (
          <p className={styles.error}>중복 확인 중 오류가 발생했습니다.</p>
        )}
        {isSuccess && (
          <p className={available ? styles.success : styles.helper}>
            {available
              ? '사용 가능한 닉네임입니다.'
              : '이미 사용 중인 닉네임입니다.'}
          </p>
        )}
        {errors.nickname && (
          <p className={styles.error}>{errors.nickname.message}</p>
        )}
      </Field>

      {/* 아이디 */}
      <Field id='username' label='아이디 (이메일)'>
        <TextInput
          id='username'
          type='email'
          placeholder='example@domain.com'
          {...register('username')}
          onChange={() => clearErrors('username')}
        />
        {errors.username && (
          <p className={styles.error}>{errors.username.message}</p>
        )}
      </Field>

      {/* 비밀번호 */}
      <Field
        id='password'
        label='비밀번호'
        hint='영문 대/소문자, 숫자, 특수문자 포함 8자 이상'
      >
        <PasswordInput
          id='password'
          {...register('password')}
          placeholder='비밀번호'
          onChange={() => clearErrors('password')}
        />
        {errors.password && (
          <p className={styles.error}>{errors.password.message}</p>
        )}
      </Field>

      {/* 비밀번호 확인 */}
      <Field id='password2' label='비밀번호 확인'>
        <PasswordInput
          id='password2'
          {...register('password2')}
          placeholder='비밀번호 확인'
          onChange={() => clearErrors('password2')}
        />
        {errors.password2 && (
          <p className={styles.error}>{errors.password2.message}</p>
        )}
      </Field>

      {/* 핀번호 */}
      <Field id='pinNumber' label='핀번호' hint='인증서 간편 비밀번호 (4자리)'>
        <OtpInput
          length={4}
          onChange={(v) => {
            setValue('pinNumber', v);
            trigger('pinNumber');
            clearErrors('pinNumber');
          }}
        />
        {errors.pinNumber && (
          <p className={styles.error}>{errors.pinNumber.message}</p>
        )}
      </Field>

      {/* 전화번호 */}
      <Field id='phoneNumber' label='전화번호'>
        <TextInput
          id='phoneNumber'
          mask='phone'
          inputMode='numeric'
          placeholder='010-1234-5678'
          {...register('phoneNumber')}
          onChange={() => clearErrors('phoneNumber')}
        />
        {errors.phoneNumber && (
          <p className={styles.error}>{errors.phoneNumber.message}</p>
        )}
      </Field>
    </>
  );
}
