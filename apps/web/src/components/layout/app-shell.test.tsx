import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AppShell } from './app-shell';

// usePathname은 App Router 런타임에만 존재하므로 테스트에서 대체한다
vi.mock('next/navigation', () => ({ usePathname: () => '/' }));

describe('AppShell', () => {
  it('하단 탭 4개와 사이드바 메뉴를 렌더한다', () => {
    render(
      <AppShell>
        <p>본문</p>
      </AppShell>,
    );

    expect(screen.getByText('본문')).toBeInTheDocument();
    // 하단 탭 + 사이드바에 각각 존재하므로 최소 1개 이상
    for (const label of ['홈', '카테고리', '마이']) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
    expect(screen.getAllByLabelText('주요 메뉴').length).toBe(2);
  });
});
