import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** 카드 컨테이너. 층 구분은 그림자 대신 --surface 단계와 --border로 한다 (DESIGN.md 5장) */
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn('rounded-card border bg-surface', className)}>{children}</section>;
}
