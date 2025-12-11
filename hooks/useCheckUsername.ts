'use client';

import { useQuery } from '@tanstack/react-query';
import { usernameCheckApi } from '@libs/api_front/usernameCheck.api';

export const useCheckUsername = (username: string, enabled = false) => {
  return useQuery({
    queryKey: ['username-check', username],
    queryFn: () => usernameCheckApi.checkUsername(username),
    enabled: enabled && !!username,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
