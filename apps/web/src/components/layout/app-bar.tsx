import { Logo } from './logo';

/**
 * 모바일 상단 앱바 (DESIGN.md 6장): 로고(좌) + 페이지 제목.
 * 데스크톱에서는 사이드바에 로고가 있으므로 숨긴다.
 */
export function AppBar() {
  return (
    <header className="bg-bg/90 sticky top-0 z-30 border-b backdrop-blur lg:hidden">
      <div className="mx-auto flex min-h-14 max-w-reading items-center px-4">
        <Logo />
      </div>
    </header>
  );
}
