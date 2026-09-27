/**
 * @gomingout/shared — 프론트·백이 공유하는 타입, Zod 스키마, 상수.
 *
 * 여기 있는 Zod 스키마로 프론트와 백엔드가 "같은 기준"으로 검증한다(절대규칙 6).
 */

// 상수
export * from './constants/mbti.js';
export * from './constants/categories.js';
export * from './constants/report-reasons.js';
export * from './constants/crisis-keywords.js';
export * from './constants/profile-enums.js';
export * from './constants/limits.js';
export * from './constants/brand.js';

// 타입
export * from './types/api.js';
export * from './types/error.js';

// 스키마
export * from './schemas/common.js';
