'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

/**
 * TanStack Query Provider.
 *
 * QueryClient를 useState로 만드는 이유:
 * 모듈 최상단에 만들면 서버에서 모든 요청이 같은 캐시를 공유한다.
 * 익명 커뮤니티에서 사용자별 viewer 상태(liked/isMine)가 섞이면 익명성 문제로 번진다.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
