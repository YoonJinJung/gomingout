import type { EmailMessage, EmailSender } from './types.js';

/**
 * 개발·테스트용 mock 발송기.
 *
 * 실제로 보내지 않고 콘솔에 출력한다. 인증 코드가 터미널에 그대로 찍히므로
 * Mailpit UI를 열지 않고도 가입 플로우를 끝까지 통과할 수 있다.
 * (배포 단계가 아니라 기능 완성이 목적인 로컬 개발에서의 기본 경로)
 *
 * 보낸 메일을 메모리에 쌓아두므로 테스트에서 "무엇이 발송됐는지" 검증할 수 있다.
 * 프로덕션에서는 절대 선택되지 않는다 — createEmailSender가 env로 분기한다.
 */
export class MockEmailSender implements EmailSender {
  readonly sent: EmailMessage[] = [];

  async send(message: EmailMessage): Promise<void> {
    this.sent.push(message);
    console.info(
      [
        '',
        '─── [mock email] ─────────────────────────────',
        `  to      : ${message.to}`,
        `  subject : ${message.subject}`,
        `  body    : ${message.text}`,
        '──────────────────────────────────────────────',
        '',
      ].join('\n'),
    );
  }

  /** 테스트에서 상태를 초기화할 때 사용한다. */
  clear(): void {
    this.sent.length = 0;
  }
}
