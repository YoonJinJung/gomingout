/**
 * 화면 확인 스크립트 (CLAUDE.md "화면 확인").
 *
 * 실행: pnpm screenshot            (dev 서버가 이미 떠 있어야 한다)
 *       pnpm screenshot -- M1      (마일스톤 번호 지정)
 *
 * 두 뷰포트로 찍는다:
 *   모바일 390×844 (iPhone 14), 데스크톱 1440×900
 *
 * 스크린샷만 찍는 게 아니라 가로 스크롤을 자동으로 잡는다.
 * 가로 스크롤은 눈으로 놓치기 쉬운데 모바일에서 가장 흔한 레이아웃 버그다.
 */
import { chromium, type Browser, type Page } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = process.env.SCREENSHOT_BASE_URL ?? 'http://localhost:3000';
const MILESTONE = process.argv[2] ?? 'M0';
const OUT_DIR = path.resolve(import.meta.dirname, '../../../docs/progress/screenshots', MILESTONE);

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844, deviceScaleFactor: 3 },
  { name: 'desktop', width: 1440, height: 900, deviceScaleFactor: 2 },
] as const;

const SCREENS = [
  { name: 'home', path: '/' },
  { name: 'categories', path: '/categories' },
  { name: 'post-detail', path: '/posts/p1' },
  { name: 'post-detail-care', path: '/posts/p4' },
  { name: 'write', path: '/write' },
  { name: 'my', path: '/me' },
  { name: 'login', path: '/login' },
] as const;

type Problem = { screen: string; viewport: string; message: string };

async function checkHorizontalScroll(page: Page): Promise<number> {
  return page.evaluate(() => {
    const { scrollWidth } = document.documentElement;
    return scrollWidth - window.innerWidth;
  });
}

async function ensureServerUp(): Promise<void> {
  try {
    const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(5_000) });
    if (!res.ok && res.status >= 500) throw new Error(`status ${String(res.status)}`);
  } catch {
    console.error(
      [
        '',
        `✗ ${BASE_URL} 에 접속할 수 없습니다.`,
        '  먼저 다른 터미널에서 개발 서버를 띄우세요:  pnpm dev',
        '',
      ].join('\n'),
    );
    process.exit(1);
  }
}

async function capture(browser: Browser): Promise<Problem[]> {
  const problems: Problem[] = [];

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: viewport.deviceScaleFactor,
      // 다크 모드가 기본이다 (DESIGN.md 2장)
      colorScheme: 'dark',
      locale: 'ko-KR',
      timezoneId: 'Asia/Seoul',
      isMobile: viewport.name === 'mobile',
      hasTouch: viewport.name === 'mobile',
    });
    const page = await context.newPage();

    // 콘솔 에러는 조용히 넘어가기 쉬우므로 모아서 보고한다
    const consoleErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });

    for (const screen of SCREENS) {
      const url = `${BASE_URL}${screen.path}`;
      const response = await page.goto(url, { waitUntil: 'networkidle' });

      if (response !== null && response.status() >= 400) {
        problems.push({
          screen: screen.name,
          viewport: viewport.name,
          message: `HTTP ${String(response.status())}`,
        });
      }

      // 글꼴이 적용된 뒤에 찍어야 타이포그래피가 정확하다
      await page.evaluate(() => document.fonts.ready);

      const overflow = await checkHorizontalScroll(page);
      if (overflow > 1) {
        problems.push({
          screen: screen.name,
          viewport: viewport.name,
          message: `가로 스크롤 ${String(overflow)}px — scrollWidth가 뷰포트보다 넓습니다`,
        });
      }

      // fullPage를 쓰지 않는 이유:
      // position:fixed인 하단 탭·사이드바가 전체 페이지 캡처에서는 페이지 중간에
      // 박제되어 실제 화면과 다르게 보인다. 뷰포트 캡처가 사용자가 보는 그대로다.
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });
      const file = path.join(OUT_DIR, `${screen.name}-${viewport.name}.png`);
      await page.screenshot({ path: file });
      console.info(`  ✓ ${screen.name}-${viewport.name}.png`);
    }

    for (const error of consoleErrors) {
      problems.push({ screen: '(콘솔)', viewport: viewport.name, message: error });
    }

    await context.close();
  }

  return problems;
}

async function main(): Promise<void> {
  await ensureServerUp();
  await mkdir(OUT_DIR, { recursive: true });

  console.info(`\n${MILESTONE} 스크린샷 → docs/progress/screenshots/${MILESTONE}/\n`);

  const browser = await chromium.launch();
  try {
    const problems = await capture(browser);

    if (problems.length === 0) {
      console.info('\n✓ 가로 스크롤·콘솔 에러 없음\n');
      return;
    }

    console.error(`\n✗ 문제 ${String(problems.length)}건:\n`);
    for (const problem of problems) {
      console.error(`  - [${problem.viewport}] ${problem.screen}: ${problem.message}`);
    }
    console.error('');
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

await main();
