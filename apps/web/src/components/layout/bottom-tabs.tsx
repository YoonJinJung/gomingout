'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from './nav-items';

/**
 * 모바일 하단 탭 (DESIGN.md 6장).
 * 데스크톱(≥1024px)에서는 사이드바로 대체되므로 숨긴다.
 */
export function BottomTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="주요 메뉴"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-surface/95 safe-bottom backdrop-blur lg:hidden"
    >
      {/* 아이콘이 상단 경계선에 붙지 않도록 여백을 둔다. 가운데 글쓰기 버튼이 -mt-4로
          올라오므로 그 공간도 함께 확보된다. */}
      <ul className="mx-auto flex max-w-reading items-stretch justify-around px-2 pt-2.5 pb-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          if (item.emphasized) {
            return (
              <li key={item.href} className="flex items-center">
                <Link
                  href={item.href}
                  aria-label={item.label}
                  className="-mt-4 flex size-14 items-center justify-center rounded-pill bg-primary text-on-primary transition-colors duration-150 hover:bg-primary-strong"
                >
                  <Icon size={24} strokeWidth={1.75} aria-hidden />
                </Link>
              </li>
            );
          }

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                // 터치 영역 최소 44×44 (DESIGN.md 11장)
                className={cn(
                  'flex min-h-14 flex-col items-center justify-center gap-1 text-caption transition-colors duration-150',
                  active ? 'text-primary' : 'text-text-muted',
                )}
              >
                <span className="relative">
                  <Icon size={20} strokeWidth={1.75} aria-hidden />
                  {/* 준비 중 표시는 아주 작은 점 하나로만. 자극적인 배지를 쓰지 않는다 (DESIGN.md 1장) */}
                  {item.comingSoon === true && (
                    <span
                      aria-hidden
                      className="absolute -top-0.5 -right-1 size-1.5 rounded-pill bg-text-subtle"
                    />
                  )}
                </span>
                {item.label}
                {item.comingSoon === true && <span className="sr-only">준비 중</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
