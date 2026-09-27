/**
 * 위기 키워드 (PRD 8장, D8).
 *
 * 왜 이 목록이 shared에 있는가:
 * 프론트는 작성 전 안내 모달을 띄우기 위해, 서버는 crisisFlag를 저장하기 위해
 * 같은 기준으로 검사해야 한다. 기준이 갈라지면 모달은 떴는데 플래그가 없거나
 * 그 반대가 되어 상담 안내 박스가 엉뚱하게 노출된다.
 *
 * 설계 원칙:
 * - 감지는 작성을 "막지 않는다". 부드러운 안내만 한다.
 * - 오탐(false positive)은 허용한다. 안내 박스가 한 번 더 보이는 비용이
 *   놓치는 비용보다 훨씬 싸다.
 */
export const CRISIS_KEYWORDS: readonly string[] = [
  '자살',
  '자살하고싶',
  '죽고싶',
  '죽고 싶',
  '죽어버리',
  '없어지고싶',
  '없어지고 싶',
  '사라지고싶',
  '사라지고 싶',
  '살기싫',
  '살기 싫',
  '살고싶지않',
  '살고 싶지 않',
  '자해',
  '손목',
  '극단적선택',
  '극단적 선택',
  '유서',
  '목숨',
  '생을마감',
  '생을 마감',
  '번개탄',
  '투신',
];

/**
 * 위기 키워드 포함 여부. 공백을 제거하고 비교해
 * "죽 고 싶 다" 같은 우회를 일부 잡는다.
 */
export function detectCrisisKeyword(text: string): boolean {
  const normalized = text.replace(/\s+/g, '');
  return CRISIS_KEYWORDS.some((keyword) => normalized.includes(keyword.replace(/\s+/g, '')));
}

/**
 * 상담 창구 (PRD 8장).
 * 배포(M8) 전 번호를 최신 정보로 재확인해야 한다.
 */
export const CRISIS_HOTLINES = [
  { name: '자살예방상담전화', phone: '109', description: '24시간' },
  { name: '정신건강위기상담전화', phone: '1577-0199', description: '24시간' },
  { name: '청소년상담전화', phone: '1388', description: '24시간' },
] as const;
