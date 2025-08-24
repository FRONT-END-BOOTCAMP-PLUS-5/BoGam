'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { axiosInstance } from '@utils/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupInput } from '@/(anon)/signup/_components/schema';
import { useRouter } from 'next/navigation';

import Field from '@/(anon)/_components/common/forms/Field';
import Button from '@/(anon)/_components/common/button/Button';
import OtpInput from '@/(anon)/_components/common/forms/OtpInput';
import TextInput from '@/(anon)/_components/common/forms/TextInput';
import PasswordInput from '@/(anon)/_components/common/forms/PasswordInput';
import { ConfirmModal } from '@/(anon)/_components/common/modal/ConfirmModal';
import { styles } from '@/(anon)/_components/common/forms/Forms.styles';

export default function SignupForm() {
  const router = useRouter();
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState('');
  const [checking, setChecking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    trigger,
    watch,
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      pinNumber: '',
    },
  });

  const onSubmit = async (data: SignupInput) => {
    console.log('onSubmit 실행');
    try {
      await axiosInstance.post('/auth/signup', data);
      setIsModalOpen(true);
    } catch (error) {
      console.log('회원가입 요청 에러:', error);

      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof error.response === 'object' &&
        error.response !== null &&
        'status' in error.response &&
        'data' in error.response
      ) {
        const errRes = error as {
          response: {
            status: number;
            data: {
              message?: string;
              issues?: { path: string[]; message: string }[];
            };
          };
        };

        if (errRes.response.status === 409) {
          console.log('중복 오류:', errRes.response.data.message);
        } else if (Array.isArray(errRes.response.data.issues)) {
          errRes.response.data.issues.forEach((issue) => {
            console.log(`유효성 오류: ${issue.path[0]} - ${issue.message}`);
          });
        } else {
          console.log(
            '기타 오류:',
            errRes.response.data.message || '회원가입 실패'
          );
        }
      } else {
        console.log('알 수 없는 오류 발생');
      }
    }
  };

  const checkNickname = async (nickname: string) => {
    if (!nickname) {
      setNicknameCheckMessage('닉네임을 입력하세요.');
      return;
    }

    setChecking(true);
    try {
      const res = await axiosInstance.get('/auth/check-nickname', {
        params: { nickname },
      });

      const data = res.data as { available: boolean };

      if (data.available) {
        setNicknameChecked(true);
        setNicknameCheckMessage('사용 가능한 닉네임입니다.');
      } else {
        setNicknameChecked(false);
        setNicknameCheckMessage('이미 사용 중인 닉네임입니다.');
      }
    } catch {
      setNicknameChecked(false);
      setNicknameCheckMessage('중복 확인 중 오류 발생');
    } finally {
      setChecking(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formRow}>
      <Field id='name' label='이름'>
        <TextInput id='name' {...register('name')} placeholder='홍길동' />
        {errors.name && <p className={styles.error}>{errors.name.message}</p>}
      </Field>

      <Field
        id='nickname'
        label='닉네임'
        hint='2~12자, 특수문자 제외'
        required={false}
      >
        <TextInput
          id='nickname'
          {...register('nickname')}
          placeholder='별명'
          rightAddon={
            <button
              type='button'
              className={styles.addonRight}
              onClick={() => checkNickname(watch('nickname'))}
              disabled={checking}
            >
              {checking ? '확인 중' : '중복확인'}
            </button>
          }
        />
        {nicknameCheckMessage && (
          <p className={nicknameChecked ? styles.helper : styles.error}>
            {nicknameCheckMessage}
          </p>
        )}
        {errors.nickname && (
          <p className={styles.error}>{errors.nickname.message}</p>
        )}
      </Field>

      <Field id='username' label='아이디 (이메일)'>
        <TextInput
          id='username'
          type='email'
          placeholder='example@domain.com'
          {...register('username')}
        />
        {errors.username && (
          <p className={styles.error}>{errors.username.message}</p>
        )}
      </Field>

      <Field
        id='password'
        label='비밀번호'
        hint='영문 대/소문자, 숫자, 특수문자 포함 8자 이상'
      >
        <PasswordInput
          id='password'
          {...register('password')}
          placeholder='비밀번호'
        />
        {errors.password && (
          <p className={styles.error}>{errors.password.message}</p>
        )}
      </Field>

      <Field id='password2' label='비밀번호 확인'>
        <PasswordInput
          id='password2'
          {...register('password2')}
          placeholder='비밀번호 확인'
        />
        {errors.password2 && (
          <p className={styles.error}>{errors.password2.message}</p>
        )}
      </Field>

      <Field id='pinNumber' label='핀번호' hint='인증서 간편 비밀번호 (4자리)'>
        <OtpInput
          length={4}
          onChange={(v) => {
            setValue('pinNumber', v);
            trigger('pinNumber');
          }}
        />
        {errors.pinNumber && (
          <p className={styles.error}>{errors.pinNumber.message}</p>
        )}
      </Field>

      <Field id='phoneNumber' label='전화번호'>
        <TextInput
          id='phoneNumber'
          mask='phone'
          inputMode='numeric'
          placeholder='010-1234-5678'
          {...register('phoneNumber')}
        />
        {errors.phoneNumber && (
          <p className={styles.error}>{errors.phoneNumber.message}</p>
        )}
      </Field>

      {errors.root?.message && (
        <p className={styles.error}>{errors.root.message}</p>
      )}

      <Button variant='primary' type='submit' fullWidth disabled={isSubmitting}>
        {isSubmitting ? '가입 중...' : '회원가입'}
      </Button>

      <Button variant='ghost' href='/signin' fullWidth>
        로그인
      </Button>

      <ConfirmModal
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title='회원가입 완료'
        onConfirm={() => {
          setIsModalOpen(false);
          router.push('/signin');
        }}
        confirmText='로그인하기'
        cancelText='닫기'
        icon='success'
      >
        회원가입이 완료되었습니다!
      </ConfirmModal>
    </form>
  );
}
