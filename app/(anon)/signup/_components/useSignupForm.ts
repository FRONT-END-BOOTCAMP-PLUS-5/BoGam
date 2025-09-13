'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupInput } from './schema';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authApi } from '@libs/api_front/auth.api';
import { useCheckNickname } from '@/hooks/useCheckNickname';
import { useCheckUsername } from '@/hooks/useCheckUsername';
import { useToastStore } from '@libs/stores/toastStore';

export function useSignupForm() {
  const router = useRouter();
  const { showError, showSuccess } = useToastStore();

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

  // 아이디 관련 상태
  const username = form.watch('username');
  const [triggerUsernameCheck, setTriggerUsernameCheck] = useState(false);
  const { data: usernameData, isSuccess: isUsernameSuccess } = useCheckUsername(
    username,
    triggerUsernameCheck
  );
  const usernameAvailable = usernameData?.available ?? false;

  const onSubmit = async (data: SignupInput) => {
    // 닉네임 중복 확인 여부
    if (!isNicknameSuccess || !nicknameAvailable) {
      form.setError('nickname', {
        type: 'manual',
        message: '닉네임 중복확인을 완료해주세요.',
      });
      return;
    }

    // 아이디 중복 확인 여부
    if (!isUsernameSuccess || !usernameAvailable) {
      form.setError('username', {
        type: 'manual',
        message: '아이디 중복확인을 완료해주세요.',
      });
      return;
    }

    try {
      await authApi.signup(data);
      showSuccess('회원가입이 완료되었습니다! 🎉');
      router.push('/signin'); // ✅ 성공 후 로그인 페이지 이동
    } catch (error) {
      showError('회원가입 중 오류가 발생했습니다.');
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
    triggerNicknameCheck,
    setTriggerNicknameCheck,
    triggerUsernameCheck,
    setTriggerUsernameCheck,
  };
}
