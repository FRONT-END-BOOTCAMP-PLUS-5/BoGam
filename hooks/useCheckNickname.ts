'use client';

import { useQuery } from '@tanstack/react-query';
import { nicknameCheckApi } from '@libs/api_front/nicknameCheck.api';

export const useCheckNickname = (nickname: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['nickname-check', nickname],
    queryFn: () => nicknameCheckApi.checkNickname(nickname),
    enabled: !!nickname && enabled,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
