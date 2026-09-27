import { Home, LayoutGrid, PenLine, User, type LucideIcon } from 'lucide-react';

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** 글쓰기는 하단 탭 가운데에서 강조된 원형 버튼으로 표시된다 (DESIGN.md 6장) */
  emphasized?: boolean;
};

/** 하단 탭 4개 / 사이드바 공용 (DESIGN.md 6장) */
export const NAV_ITEMS: readonly NavItem[] = [
  { href: '/', label: '홈', icon: Home },
  { href: '/categories', label: '카테고리', icon: LayoutGrid },
  { href: '/write', label: '글쓰기', icon: PenLine, emphasized: true },
  { href: '/me', label: '마이', icon: User },
];
