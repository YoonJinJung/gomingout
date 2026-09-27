/** 신고 사유. Prisma enum ReportReason과 1:1로 대응한다. */
export const REPORT_REASONS = ['ABUSE', 'SPAM', 'SEXUAL', 'PRIVACY', 'SELF_HARM', 'OTHER'] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  ABUSE: '욕설·비하',
  SPAM: '스팸·광고',
  SEXUAL: '음란물',
  PRIVACY: '개인정보 노출',
  SELF_HARM: '자해·자살 조장',
  OTHER: '기타',
};

/** OTHER를 선택하면 상세 입력을 받는다. */
export const REPORT_DETAIL_REQUIRED_REASONS: readonly ReportReason[] = ['OTHER'];
export const REPORT_DETAIL_MAX_LENGTH = 300;
