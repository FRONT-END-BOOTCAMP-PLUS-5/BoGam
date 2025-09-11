'use client';

import { useQuery } from '@tanstack/react-query';
import { nicknameCheckApi } from '@libs/api_front/nicknameCheck.api';

export const useCheckNickname = (nickname: string, enabled = false) => {
  return useQuery({
    queryKey: ['nickname-check', nickname],
    queryFn: () => nicknameCheckApi.checkNickname(nickname),
    enabled: enabled && !!nickname, //닉네임 입력시에만 실행
    retry: 2, //재시도 횟수 2회
  });
};
