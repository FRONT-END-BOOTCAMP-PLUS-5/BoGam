'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupInput } from './schema';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authApi } from '@libs/api_front/auth.api';
import { useCheckNickname } from '@/hooks/useCheckNickname';
import { useCheckUsername } from '@/hooks/useCheckUsername';

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

  // 닉네임 관련 상태
  const nickname = form.watch('nickname');
  const [triggerNicknameCheck, setTriggerNicknameCheck] = useState(false);
  const { data: nicknameData, isSuccess: isNicknameSuccess } = useCheckNickname(
    nickname,
    triggerNicknameCheck
  );
  const nicknameAvailable = nicknameData?.available ?? false;

  // 아이디(Username) 관련 상태
  const username = form.watch('username');
  const [triggerUsernameCheck, setTriggerUsernameCheck] = useState(false);
  const { data: usernameData, isSuccess: isUsernameSuccess } = useCheckUsername(
    username,
    triggerUsernameCheck
  );
  const usernameAvailable = usernameData?.available ?? false;

  const onSubmit = async (data: SignupInput) => {
    setSignupError('');

    // 닉네임 중복 확인 조건 검사
    if (!isNicknameSuccess || !nicknameAvailable) {
      form.setError('nickname', {
        type: 'manual',
        message: '닉네임 중복확인을 완료해주세요.',
      });
      return;
    }

    // 아이디(Username) 중복 확인 조건 검사
    if (!isUsernameSuccess || !usernameAvailable) {
      form.setError('username', {
        type: 'manual',
        message: '아이디 중복확인을 완료해주세요.',
      });
      return;
    }

    try {
      await authApi.signup(data);
      setIsModalOpen(true);
    } catch (error) {
      setSignupError('회원가입 중 오류가 발생했습니다.');
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
    triggerNicknameCheck,
    setTriggerNicknameCheck,
    triggerUsernameCheck,
    setTriggerUsernameCheck,
  };
}
