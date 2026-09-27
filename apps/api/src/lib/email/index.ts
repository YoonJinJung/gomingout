import { env } from '../../config/env.js';
import { MockEmailSender } from './mock-email-sender.js';
import { SmtpEmailSender } from './smtp-email-sender.js';
import type { EmailSender } from './types.js';

export type { EmailMessage, EmailSender } from './types.js';
export { MockEmailSender } from './mock-email-sender.js';

/**
 * 구현 선택은 여기 한 곳에서만 한다(CLAUDE.md 로컬 개발 원칙 4).
 * - mock   : 콘솔 출력. 인증 코드를 터미널에서 바로 확인 (가장 빠른 로컬 경로)
 * - smtp   : Docker Mailpit. http://localhost:8025 에서 확인
 * - resend : 배포(M8)에서 구현
 */
export function createEmailSender(): EmailSender {
  switch (env.EMAIL_PROVIDER) {
    case 'mock':
      return new MockEmailSender();
    case 'smtp':
      return new SmtpEmailSender();
    case 'resend':
      throw new Error('Resend EmailSender는 M8에서 구현됩니다.');
  }
}
