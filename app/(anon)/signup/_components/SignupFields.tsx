'use client';

import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SignupInput } from './schema';
import Field from '@/(anon)/_components/common/forms/Field';
import TextInput from '@/(anon)/_components/common/forms/TextInput';
import PasswordInput from '@/(anon)/_components/common/forms/PasswordInput';
import OtpInput from '@/(anon)/_components/common/forms/OtpInput';
import { styles } from '@/(anon)/_components/common/forms/Forms.styles';
import { useCheckNickname } from '@/hooks/useCheckNickname';
import { useCheckUsername } from '@/hooks/useCheckUsername';

interface Props {
  form: UseFormReturn<SignupInput>;
  triggerNicknameCheck: boolean;
  setTriggerNicknameCheck: (value: boolean) => void;
  triggerUsernameCheck: boolean;
  setTriggerUsernameCheck: (value: boolean) => void;
}

export function SignupFields({
  form,
  triggerNicknameCheck,
  setTriggerNicknameCheck,
  triggerUsernameCheck,
  setTriggerUsernameCheck,
}: Props) {
  const {
    register,
    watch,
    setValue,
    clearErrors,
    setError,
    trigger,
    formState: { errors },
  } = form;

  const nickname = watch('nickname');
  const username = watch('username');

  const [nicknameAvailable, setNicknameAvailable] = useState<
    boolean | undefined
  >(undefined);
  const [usernameAvailable, setUsernameAvailable] = useState<
    boolean | undefined
  >(undefined);

  const [nicknameMessage, setNicknameMessage] = useState<string | null>(null);
  const [usernameMessage, setUsernameMessage] = useState<string | null>(null);

  const {
    data: nicknameData,
    isFetching: isNicknameFetching,
    isError: isNicknameError,
    isSuccess: isNicknameSuccess,
  } = useCheckNickname(nickname, triggerNicknameCheck);

  const {
    data: usernameData,
    isFetching: isUsernameFetching,
    isError: isUsernameError,
    isSuccess: isUsernameSuccess,
  } = useCheckUsername(username, triggerUsernameCheck);

  useEffect(() => {
    if (triggerNicknameCheck && isNicknameSuccess) {
      const available = nicknameData?.available ?? false;
      if (available) {
        setNicknameAvailable(true);
        clearErrors('nickname');
        setNicknameMessage('사용 가능한 닉네임입니다.');
      } else {
        setNicknameAvailable(false);
        setError('nickname', {
          type: 'manual',
          message: '이미 사용 중인 닉네임입니다.',
        });
        setNicknameMessage(null);
      }
      setTriggerNicknameCheck(false);
    }
  }, [triggerNicknameCheck, isNicknameSuccess, nicknameData]);

  useEffect(() => {
    if (triggerUsernameCheck && isUsernameSuccess) {
      const available = usernameData?.available ?? false;
      if (available) {
        setUsernameAvailable(true);
        clearErrors('username');
        setUsernameMessage('사용 가능한 아이디입니다.');
      } else {
        setUsernameAvailable(false);
        setError('username', {
          type: 'manual',
          message: '이미 사용 중인 아이디입니다.',
        });
        setUsernameMessage(null);
      }
      setTriggerUsernameCheck(false);
    }
  }, [triggerUsernameCheck, isUsernameSuccess, usernameData]);

  return (
    <>
      {/* 이름 */}
      <Field id='name' label='이름'>
        <TextInput
          id='name'
          {...register('name')}
          placeholder='홍길동'
          onChange={() => clearErrors('name')}
        />
        {errors.name && <p className={styles.error}>{errors.name.message}</p>}
      </Field>

      {/* 닉네임 */}
      <Field id='nickname' label='닉네임' hint='2글자 이상 입력하세요.'>
        <TextInput
          id='nickname'
          {...register('nickname')}
          placeholder='별명'
          rightAddon={
            <button
              type='button'
              className={
                nicknameAvailable
                  ? styles.addonRightDisabled
                  : styles.addonRight
              }
              onClick={() => {
                const currentNickname = form.getValues('nickname');
                console.log(currentNickname);
                if (currentNickname.trim().length < 2) {
                  setError('nickname', {
                    type: 'manual',
                    message: '닉네임은 최소 2자 이상 입력해주세요.',
                  });
                  return;
                }
                setTriggerNicknameCheck(true);
              }}
              disabled={nicknameAvailable}
            >
              {isNicknameFetching ? '확인 중' : '중복확인'}
            </button>
          }
          onChange={() => {
            setNicknameAvailable(undefined);
            setNicknameMessage(null);
            setTriggerNicknameCheck(false);
            clearErrors('nickname');
          }}
        />
        {isNicknameError && (
          <p className={styles.error}>중복 확인 중 오류가 발생했습니다.</p>
        )}
        {nicknameMessage && !errors.nickname && (
          <p className={styles.success}>{nicknameMessage}</p>
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
          rightAddon={
            <button
              type='button'
              className={
                usernameAvailable
                  ? styles.addonRightDisabled
                  : styles.addonRight
              }
              onClick={() => {
                const currentUsername = form.getValues('username');
                console.log('');
                if (!currentUsername.trim()) {
                  setError('username', {
                    type: 'manual',
                    message: '아이디를 입력해주세요.',
                  });
                  return;
                }
                setTriggerUsernameCheck(true);
              }}
              disabled={usernameAvailable}
            >
              {isUsernameFetching ? '확인 중' : '중복확인'}
            </button>
          }
          onChange={() => {
            setUsernameAvailable(undefined);
            setUsernameMessage(null);
            setTriggerUsernameCheck(false);
            clearErrors('username');
          }}
        />
        {isUsernameError && (
          <p className={styles.error}>중복 확인 중 오류가 발생했습니다.</p>
        )}
        {usernameMessage && !errors.username && (
          <p className={styles.success}>{usernameMessage}</p>
        )}
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
