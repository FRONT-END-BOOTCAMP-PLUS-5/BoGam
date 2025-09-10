'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupInput } from './schema';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { axiosInstance } from '@utils/axios';

export function useSignupForm() {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [signupError, setSignupError] = useState('');

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      pinNumber: '',
    },
  });

  const onSubmit = async (data: SignupInput) => {
    setSignupError('');
    try {
      await axiosInstance.post('/users/signup', data);
      setIsModalOpen(true);
    } catch (error) {
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
          const errorMessage =
            errRes.response.data.message || '이미 존재하는 아이디입니다.';
          setSignupError(errorMessage);
        } else if (Array.isArray(errRes.response.data.issues)) {
          const validationErrors = errRes.response.data.issues
            .map((issue) => `${issue.path[0]}: ${issue.message}`)
            .join(', ');
          setSignupError(`입력 정보를 확인해주세요: ${validationErrors}`);
        } else {
          setSignupError('회원가입에 실패했습니다.');
        }
      } else {
        setSignupError('회원가입 중 오류가 발생했습니다.');
      }
      setIsErrorModalOpen(true);
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
    isModalOpen,
    isErrorModalOpen,
    signupError,
    closeSuccessModal: () => setIsModalOpen(false),
    closeErrorModal: () => {
      setIsErrorModalOpen(false);
      setSignupError('');
    },
    goToSignin: () => {
      setIsModalOpen(false);
      router.push('/signin');
    },
  };
}
