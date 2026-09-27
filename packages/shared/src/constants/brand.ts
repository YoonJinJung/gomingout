/**
 * PWA·브라우저 크롬에 쓰이는 브랜드 색 (DESIGN.md 13장).
 *
 * 왜 CSS 토큰이 아니라 여기 있는가:
 * `<meta name="theme-color">`와 PWA manifest의 `theme_color`는 HTML/JSON 값이라
 * CSS 변수를 쓸 수 없다. 메타 태그(현재)와 manifest(M7)가 서로 다른 값을 갖지 않도록
 * 한 곳에 둔다. 화면 안의 색은 반드시 globals.css의 토큰을 쓴다.
 */
export const BRAND_COLORS = {
  /** --bg 와 같은 값이어야 한다 */
  theme: '#0E1123',
  background: '#0E1123',
} as const;
