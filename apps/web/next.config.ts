import type { NextConfig } from 'next';

const API_ORIGIN = process.env.API_ORIGIN ?? 'http://localhost:4000';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Next가 apps/web에 AGENTS.md·CLAUDE.md를 자동 생성하는 것을 끈다.
  // 이 프로젝트의 작업 지침은 루트 CLAUDE.md 하나로 관리한다.
  agentRules: false,

  // 개발 인디케이터 배지가 하단 탭을 가려 스크린샷 확인을 방해하므로 끈다.
  devIndicators: false,

  /**
   * /api/* 를 Express 서버로 넘긴다 (CLAUDE.md 로컬 개발 원칙 2, T3).
   *
   * 왜 rewrite인가:
   * 브라우저 입장에서는 같은 오리진(localhost:3000)이므로 인증 쿠키가 그대로 실린다.
   * 배포(M8)에서도 같은 구조를 유지해 코드를 바꾸지 않는다 — API_ORIGIN만 교체한다.
   *
   * ⚠️ 이 구조 때문에 apps/web 안에 app/api 라우트를 만들면 안 된다. 경로가 충돌한다.
   */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_ORIGIN}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
