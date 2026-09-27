import nodemailer from 'nodemailer';
import { env } from '../../config/env.js';
import type { EmailMessage, EmailSender } from './types.js';

/** 로컬 개발용. Docker Mailpit(localhost:1025)으로 보내고 http://localhost:8025 에서 확인한다. */
export class SmtpEmailSender implements EmailSender {
  private readonly transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false,
    // Mailpit은 인증이 필요 없다
    ignoreTLS: true,
  });

  async send(message: EmailMessage): Promise<void> {
    await this.transporter.sendMail({
      from: env.EMAIL_FROM,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
  }
}
