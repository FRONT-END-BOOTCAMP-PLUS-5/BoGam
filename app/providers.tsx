'use client';

import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5분 데이터가 신선하다고 간주
            gcTime: 10 * 60 * 1000, // 10분 후 메모리에서 삭제
            retry: 5, // 5번까지 로그인 Try 가능
            refetchOnWindowFocus: false, // 창이 다시 focus 될 때 재요청 안 함
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </SessionProvider>
    </QueryClientProvider>
  );
}
