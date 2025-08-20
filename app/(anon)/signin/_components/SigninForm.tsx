'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Field from '@/(anon)/_components/common/forms/Field';
import Button from '@/(anon)/_components/common/button/Button';
import TextInput from '@/(anon)/_components/common/forms/TextInput';
import PasswordInput from '@/(anon)/_components/common/forms/PasswordInput';
import { styles } from '@/(anon)/_components/common/forms/Forms.styles';

const signinSchema = z.object({
  username: z.string().email('올바른 이메일을 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

type SigninInput = z.infer<typeof signinSchema>;

export default function SigninForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SigninInput>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: SigninInput) => {
    const res = await signIn('credentials', {
      redirect: false,
      username: data.username,
      password: data.password,
    });

    if (res?.error) {
      setError('root', {
        message: '아이디 또는 비밀번호가 올바르지 않습니다.',
      });
    } else {
      router.push('/main'); // 로그인 후 메인 페이지로 이동
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formRow}>
      <Field id='username' label='아이디'>
        <TextInput
          id='username'
          type='email'
          placeholder='example@naver.com'
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
          placeholder='비밀번호'
          {...register('password')}
        />
        {errors.password && (
          <p className={styles.error}>{errors.password.message}</p>
        )}
      </Field>

      {errors.root?.message && (
        <p className={styles.error}>{errors.root.message}</p>
      )}

      <Button type='submit' fullWidth disabled={isSubmitting}>
        {isSubmitting ? '로그인 중...' : '로그인'}
      </Button>
      <Button variant='ghost' href='/signup' fullWidth>
        회원가입
      </Button>
    </form>
  );
}
