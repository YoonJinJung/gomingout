// @ts-check
import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/coverage/**',
      '**/src/generated/**', // Prisma 생성 코드
      '**/playwright-report/**',
      '**/test-results/**',
      '**/*.config.js',
      'apps/web/src/components/ui/**', // shadcn/ui 생성 코드
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // CLAUDE.md 코드 컨벤션: any 금지
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // await 누락은 익명성·트랜잭션 로직에서 조용한 버그가 되므로 error
      '@typescript-eslint/no-floating-promises': 'error',
      // EmailSender·RateLimiter는 인터페이스가 Promise를 요구한다.
      // 로컬(메모리·콘솔) 구현은 동기지만 배포 구현(Upstash·Resend)은 비동기이므로
      // 시그니처를 async로 유지해야 한다 — 이 규칙과 설계가 충돌한다.
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-misused-promises': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-console': 'off',
    },
  },

  // React 훅 규칙 (web)
  {
    files: ['apps/web/**/*.tsx'],
    ...reactHooks.configs.flat['recommended-latest'],
  },

  // 설정 파일 · 스크립트: Node 전역
  {
    files: ['**/*.config.{ts,mts,mjs}', '**/scripts/**/*.ts', 'eslint.config.mjs'],
    languageOptions: { globals: globals.node },
  },

  // 타입 정보가 필요 없는 순수 JS 설정 파일
  {
    files: ['**/*.mjs', '**/*.js'],
    ...tseslint.configs.disableTypeChecked,
  },
);
