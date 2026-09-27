import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** shadcn/ui 규약. 조건부 클래스 병합 시 뒤 값이 이긴다. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * UTC로 저장된 시각을 KST 기준으로 표시한다(CLAUDE.md 코드 컨벤션).
 * M0에서는 기본 포맷만 두고, 상대 시간("3시간 전")은 사용처가 생기는 M2에서 추가한다.
 */
export function formatKst(iso: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}
