import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { AppShell } from '@/components/layout/app-shell';
import { QueryProvider } from '@/lib/query-provider';
import './globals.css';

/**
 * Pretendard Variable (DESIGN.md 4장).
 * self-host 하는 이유: 외부 요청이 없어 M7 PWA 오프라인에서도 글꼴이 유지된다.
 */
const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  weight: '45 920',
  display: 'swap',
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
});

export const metadata: Metadata = {
  title: {
    default: '고밍아웃',
    template: '%s · 고밍아웃',
  },
  description: '털어놓기 어려운 고민을, 익명으로도 닉네임으로도 나눌 수 있는 고민상담 커뮤니티',
  applicationName: '고밍아웃',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // 하단 탭 safe-area를 쓰기 위해 필요 (DESIGN.md 6장)
  viewportFit: 'cover',
  themeColor: '#0E1123', // DESIGN.md 13장
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // 다크 모드가 기본이다 (D15, DESIGN.md 2장). 테마 전환은 M7에서 추가한다.
    <html lang="ko" data-theme="dark">
      <body className={pretendard.variable}>
        <QueryProvider>
          <AppShell>{children}</AppShell>
        </QueryProvider>
      </body>
    </html>
  );
}
