'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { NAV_ITEMS } from './nav-items';

/**
 * 데스크톱 사이드바 (DESIGN.md 6장).
 * 768~1023px 구간은 모바일 레이아웃(하단 탭)을 그대로 쓴다 — lg(1024px)에서만 나타난다.
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:px-4 lg:py-6">
      <Link href="/" className="rounded-control px-2 py-1">
        <Logo />
      </Link>

      <nav aria-label="주요 메뉴" className="mt-8 flex flex-col gap-1">
        {NAV_ITEMS.filter((item) => !item.emphasized).map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex min-h-11 items-center gap-3 rounded-control px-3 text-body-sm transition-colors duration-150',
                active
                  ? 'bg-primary-soft text-primary'
                  : 'text-text-muted hover:bg-surface-2 hover:text-text',
              )}
            >
              <Icon size={20} strokeWidth={1.75} aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/write"
        className="bg-primary text-on-primary hover:bg-primary-strong mt-6 flex min-h-11 items-center justify-center gap-2 rounded-control px-4 text-body-sm font-semibold transition-colors duration-150"
      >
        글쓰기
      </Link>

      <div className="mt-auto">
        <Link
          href="/login"
          className="text-text-muted hover:text-text flex min-h-11 items-center px-3 text-body-sm transition-colors duration-150"
        >
          로그인
        </Link>
      </div>
    </aside>
  );
}
