/**
 * EmailSender 인터페이스.
 *
 * 왜 인터페이스로 감싸는가 (CLAUDE.md 로컬 개발 원칙 4):
 * 로컬은 Mailpit(SMTP), 배포(M8)는 Resend를 쓴다.
 * 구현을 갈아끼우기만 하고 호출하는 코드는 건드리지 않기 위해서다.
 */
export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export interface EmailSender {
  send(message: EmailMessage): Promise<void>;
}
