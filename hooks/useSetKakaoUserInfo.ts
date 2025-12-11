import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SignupInput } from '@/(anon)/signup/_components/schema';

interface KakaoUser {
  name: string;
  nickname: string;
  username: string;
}

export function useSetKakaoUserInfo(
  form: UseFormReturn<SignupInput>,
  kakaoUser: KakaoUser | null
) {
  const { setValue } = form;

  useEffect(() => {
    if (kakaoUser) {
      setValue('name', kakaoUser.name);
      setValue('nickname', kakaoUser.nickname);
      setValue('username', kakaoUser.username);
    }
  }, [kakaoUser, setValue]);
}
