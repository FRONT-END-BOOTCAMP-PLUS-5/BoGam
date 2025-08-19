'use client';

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
import styles from '@/(anon)/_components/common/forms/Forms.module.css';

export default function SignupForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    trigger,
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
      alert('회원가입이 완료되었습니다!');
      router.push('/signin');
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
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formRow}>
      <Field id='name' label='이름'>
        <TextInput id='name' {...register('name')} placeholder='홍길동' />
        {errors.name && <p className={styles.error}>{errors.name.message}</p>}
      </Field>

      <Field id='nickname' label='닉네임' hint='2~12자, 특수문자 제외'>
        <TextInput id='nickname' {...register('nickname')} placeholder='별명' />
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

      <Button type='submit' fullWidth disabled={isSubmitting}>
        {isSubmitting ? '가입 중...' : '회원가입'}
      </Button>

      <Button variant='ghost' href='/signin' fullWidth>
        로그인
      </Button>
    </form>
  );
}
