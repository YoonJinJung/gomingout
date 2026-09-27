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
      className="bg-surface/95 safe-bottom fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur lg:hidden"
    >
      <ul className="mx-auto flex max-w-reading items-stretch justify-around">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          if (item.emphasized) {
            return (
              <li key={item.href} className="flex items-center">
                <Link
                  href={item.href}
                  aria-label={item.label}
                  className="bg-primary text-on-primary hover:bg-primary-strong -mt-4 flex size-14 items-center justify-center rounded-pill transition-colors duration-150"
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
                <Icon size={20} strokeWidth={1.75} aria-hidden />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
