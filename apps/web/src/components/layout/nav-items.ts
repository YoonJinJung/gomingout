import { Home, LayoutGrid, Mail, PenLine, User, type LucideIcon } from 'lucide-react';

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** 글쓰기는 하단 탭 가운데에서 강조된 원형 버튼으로 표시된다 (DESIGN.md 6장) */
  emphasized?: boolean;
  /**
   * 아직 만들지 않은 기능. 자리만 미리 보여준다 (D24).
   * 누르면 "준비 중" 안내 화면으로 간다 — 막다른 곳으로 보내지 않는다.
   */
  comingSoon?: boolean;
};

/**
 * 하단 탭 5개 / 사이드바 공용 (DESIGN.md 6장).
 * 글쓰기를 가운데(index 2)에 두어 좌우 2개씩 균형을 맞춘다.
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { href: '/', label: '홈', icon: Home },
  { href: '/categories', label: '카테고리', icon: LayoutGrid },
  { href: '/write', label: '글쓰기', icon: PenLine, emphasized: true },
  { href: '/messages', label: '쪽지', icon: Mail, comingSoon: true },
  { href: '/me', label: '마이', icon: User },
];
