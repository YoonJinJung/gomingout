import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AppShell } from './app-shell';
import { NAV_ITEMS } from './nav-items';

// usePathname은 App Router 런타임에만 존재하므로 테스트에서 대체한다
vi.mock('next/navigation', () => ({ usePathname: () => '/' }));

describe('AppShell', () => {
  it('하단 탭과 사이드바 메뉴를 렌더한다', () => {
    render(
      <AppShell>
        <p>본문</p>
      </AppShell>,
    );

    expect(screen.getByText('본문')).toBeInTheDocument();
    // 하단 탭 + 사이드바에 각각 존재하므로 최소 1개 이상
    for (const label of ['홈', '카테고리', '쪽지', '마이']) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
    expect(screen.getAllByLabelText('주요 메뉴').length).toBe(2);
  });

  it('준비 중인 메뉴에도 도착할 화면이 있다 — 막다른 링크를 두지 않는다', () => {
    const comingSoon = NAV_ITEMS.filter((item) => item.comingSoon === true);

    expect(comingSoon.length).toBeGreaterThan(0);
    for (const item of comingSoon) {
      expect(item.href).toMatch(/^\//);
    }
  });
});

describe('NAV_ITEMS', () => {
  it('하단 탭은 5개이고 글쓰기가 가운데다 (DESIGN.md 6장)', () => {
    expect(NAV_ITEMS).toHaveLength(5);
    expect(NAV_ITEMS[2]?.emphasized).toBe(true);
    expect(NAV_ITEMS[2]?.label).toBe('글쓰기');
  });

  it('강조 탭은 하나뿐이다 — 가운데 원형 버튼이 둘이면 레이아웃이 깨진다', () => {
    expect(NAV_ITEMS.filter((item) => item.emphasized === true)).toHaveLength(1);
  });

  it('href가 중복되지 않는다', () => {
    const hrefs = NAV_ITEMS.map((item) => item.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});
