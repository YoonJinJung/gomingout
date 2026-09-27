import type { ReactNode } from 'react';
import { AppBar } from './app-bar';
import { BottomTabs } from './bottom-tabs';
import { Sidebar } from './sidebar';

/**
 * 공통 레이아웃 (DESIGN.md 6장).
 * - 모바일(<1024px): 상단 앱바 + 하단 탭 4개
 * - 데스크톱(≥1024px): 좌측 사이드바 + 가운데 본문 컬럼(최대 680px)
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh lg:pl-64">
      <Sidebar />
      <AppBar />

      <main
        // 하단 탭에 본문이 가리지 않도록 여백을 둔다 (모바일에서만)
        className="mx-auto w-full max-w-reading px-4 pt-4 pb-28 lg:px-8 lg:pt-8 lg:pb-12"
      >
        {children}
      </main>

      <BottomTabs />
    </div>
  );
}
