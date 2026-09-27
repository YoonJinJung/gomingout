import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app.js';

const app = createApp();

describe('GET /api/health', () => {
  it('ok와 db 상태, UTC 시각을 반환한다', async () => {
    const res = await request(app).get('/api/health');

    // DB가 떠 있으면 200, 없으면 503 — 둘 다 형식은 같아야 한다
    expect([200, 503]).toContain(res.status);
    expect(res.body).toMatchObject({
      ok: expect.any(Boolean) as boolean,
      db: expect.stringMatching(/^(up|down)$/) as string,
    });
    // 시간은 UTC(ISO 8601)로 내려간다
    expect(new Date(res.body.time as string).toISOString()).toBe(res.body.time);
  });

  it('응답을 캐시하지 않는다 — viewer 상태가 다른 사용자에게 새는 것을 막는다', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['cache-control']).toBe('private, no-store');
  });

  it('서버 구현(x-powered-by)을 노출하지 않는다', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });
});

describe('에러 응답 형식', () => {
  it('없는 경로는 { error: { code, message } } 형식의 404를 반환한다', async () => {
    const res = await request(app).get('/api/이런건없어요');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: { code: 'NOT_FOUND', message: expect.any(String) as string },
    });
  });
});
