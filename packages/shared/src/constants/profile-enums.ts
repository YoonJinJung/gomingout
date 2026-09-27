/**
 * 프로필 선택 항목. Prisma enum과 1:1로 대응한다.
 * 라벨은 UI 표시용이며, 값 자체는 DB에 저장된다.
 */

export const AGE_RANGES = [
  'TEEN_MID',
  'TEEN_LATE',
  'TWENTIES_EARLY',
  'TWENTIES_LATE',
  'THIRTIES',
  'FORTIES_PLUS',
] as const;
export type AgeRange = (typeof AGE_RANGES)[number];

/** TEEN_MID는 가입 하한(만 14세)을 담기 위한 구간이다. */
export const AGE_RANGE_LABELS: Record<AgeRange, string> = {
  TEEN_MID: '14~16세',
  TEEN_LATE: '17~19세',
  TWENTIES_EARLY: '20대 초반',
  TWENTIES_LATE: '20대 후반',
  THIRTIES: '30대',
  FORTIES_PLUS: '40대 이상',
};

export const GENDERS = ['MALE', 'FEMALE', 'OTHER'] as const;
export type Gender = (typeof GENDERS)[number];

export const GENDER_LABELS: Record<Gender, string> = {
  MALE: '남성',
  FEMALE: '여성',
  OTHER: '기타',
};

export const OCCUPATIONS = ['STUDENT', 'JOB_SEEKER', 'EMPLOYEE', 'SELF_EMPLOYED', 'OTHER'] as const;
export type Occupation = (typeof OCCUPATIONS)[number];

export const OCCUPATION_LABELS: Record<Occupation, string> = {
  STUDENT: '학생',
  JOB_SEEKER: '취준생',
  EMPLOYEE: '직장인',
  SELF_EMPLOYED: '자영업',
  OTHER: '기타',
};

/** 가입 가능 최소 연령 (D6) */
export const MIN_SIGNUP_AGE = 14;
