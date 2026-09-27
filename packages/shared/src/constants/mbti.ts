/** MBTI 16종. 프로필 필수 항목이며, 익명 글·댓글에 노출 가능한 유일한 프로필 정보다. */
export const MBTI_TYPES = [
  'ISTJ',
  'ISFJ',
  'INFJ',
  'INTJ',
  'ISTP',
  'ISFP',
  'INFP',
  'INTP',
  'ESTP',
  'ESFP',
  'ENFP',
  'ENTP',
  'ESTJ',
  'ESFJ',
  'ENFJ',
  'ENTJ',
] as const;

export type Mbti = (typeof MBTI_TYPES)[number];

export function isMbti(value: string): value is Mbti {
  return (MBTI_TYPES as readonly string[]).includes(value);
}
