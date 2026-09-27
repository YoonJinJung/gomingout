/**
 * 시간 표시. DB·API는 UTC(ISO 8601), 화면은 KST (CLAUDE.md 코드 컨벤션).
 *
 * 스크린샷 재현성을 위해 "지금"을 주입받을 수 있게 했다.
 * Date.now()를 직접 쓰면 찍을 때마다 "3시간 전"이 달라져 스크린샷 비교가 어렵다.
 */
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function formatRelativeKst(iso: string, now: number = Date.now()): string {
  const diff = now - new Date(iso).getTime();

  if (diff < MINUTE) return '방금';
  if (diff < HOUR) return `${String(Math.floor(diff / MINUTE))}분 전`;
  if (diff < DAY) return `${String(Math.floor(diff / HOUR))}시간 전`;
  if (diff < 7 * DAY) return `${String(Math.floor(diff / DAY))}일 전`;

  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso));
}
