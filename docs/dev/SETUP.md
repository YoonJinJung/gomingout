# 로컬 개발 환경 설정

처음 받은 사람이 이 문서만 보고 `pnpm dev`까지 갈 수 있어야 한다.

## 1. 필요한 것

| 도구 | 버전 | 확인 |
|---|---|---|
| Node.js | **22.x** (개발 기준 22.23.3) | `node -v` |
| pnpm | **12.6.0** | `pnpm -v` |
| Docker Desktop | 실행 중이어야 함 | `docker info` |

```bash
# Node 22 (nvm 사용 시). 저장소에 .nvmrc가 있다.
nvm install 22 && nvm use 22

# pnpm (corepack 사용)
corepack enable pnpm
```

> `nvm use`는 셸마다 해야 한다. 새 터미널을 열면 다시 실행한다.

## 2. 설치

```bash
git clone https://github.com/YoonJinJung/gomingout.git
cd gomingout
pnpm install
```

## 3. 환경변수

```bash
cp apps/api/.env.example apps/api/.env
```

기본값 그대로 로컬에서 동작한다. 항목 설명은 [ENV.md](./ENV.md) 참고.

## 4. 데이터베이스 · 메일

```bash
pnpm db:up          # Postgres + Mailpit 컨테이너 기동
docker compose ps   # 둘 다 healthy 확인
```

| 서비스 | 주소 | 비고 |
|---|---|---|
| Postgres | `localhost:5433` | 호스트 5432를 다른 프로젝트가 쓰는 경우가 있어 5433으로 노출한다 |
| Mailpit 웹 UI | http://localhost:8025 | `EMAIL_PROVIDER=smtp`일 때 발송 메일 확인 |
| Mailpit SMTP | `localhost:1025` | |

Prisma 클라이언트 생성:

```bash
pnpm --filter @gomingout/api prisma:generate
```

## 5. 실행

```bash
pnpm dev
```

한 번의 명령으로 셋이 함께 뜬다.

| 프로세스 | 주소 |
|---|---|
| web (Next.js) | http://localhost:3000 |
| api (Express) | http://localhost:4000 |
| shared (tsc --watch) | 변경 시 자동 재빌드 |

확인:

```bash
curl localhost:3000/api/health
# {"ok":true,"db":"up","time":"..."}
```

`localhost:3000`으로 확인하는 것이 중요하다. Next rewrites가 `/api/*`를 Express로 넘기는지까지 검증되기 때문이다.

## 6. 자주 쓰는 명령

| 명령 | 설명 |
|---|---|
| `pnpm dev` | web + api + shared 동시 실행 |
| `pnpm verify` | format:check → lint → typecheck → test 전부 |
| `pnpm test` | 전체 테스트 |
| `pnpm lint` / `pnpm lint:fix` | ESLint |
| `pnpm typecheck` | 타입 검사 |
| `pnpm format` | Prettier 적용 |
| `pnpm screenshot` | 스크린샷 (dev 서버가 떠 있어야 함) |
| `pnpm db:up` / `db:down` | Docker 기동 / 종료 |
| `pnpm db:reset` | 볼륨까지 삭제 후 재생성 |

## 7. 고정한 버전과 이유

exact 버전으로 고정(`save-exact=true`)하고 `pnpm-lock.yaml`을 커밋한다.

| 패키지 | 버전 |
|---|---|
| Next.js | 16.3.6 |
| React | 19.3.0 |
| Tailwind CSS | 4.3.3 (CSS-first `@theme`) |
| TypeScript | **5.9.3** |
| Zod | 4.6.5 |
| Express | 5.2.1 |
| Prisma / @prisma/client | **7.10.0** |
| Vitest | 5.0.2 |
| Playwright | 1.63.0 |
| ESLint | 10.11.0 |

### 최신 버전을 쓰지 않은 두 가지 (되돌리기 전에 읽을 것)

1. **Prisma 7.10.0** — npm `latest` 태그가 `8.0.0-rc.17`(릴리스 후보)이고 `@prisma/client`의
   `latest`는 7.10.0이라 서로 어긋난다. 안정판이자 짝이 맞는 7.10.0으로 고정했다.
2. **TypeScript 5.9.3** — 최신은 7.0.2지만 `typescript-eslint@8`의 peer 범위가 `>=4.8.4 <6.1.0`이고
   TypeScript 6 stable은 존재하지 않는다(beta/dev만 있음). CLAUDE.md의 "`any` 금지"를 lint로
   강제하려면 typescript-eslint가 필요하므로 5.9.3을 선택했다.
   → typescript-eslint가 TS 7을 지원하면 재검토한다.

`eslint-config-next`도 같은 이유로 제외했다. 전이 의존(eslint-plugin-import/jsx-a11y/react)이
아직 ESLint 10을 지원하지 않는다. 대신 typescript-eslint(타입 인식) + eslint-plugin-react-hooks를 쓴다.

## 8. 막힐 때

| 증상 | 원인 · 해결 |
|---|---|
| `pnpm: command not found` | `corepack enable pnpm` |
| `Bind for 0.0.0.0:5433 failed` | 다른 프로세스가 5433 점유. `docker-compose.yml`과 `.env`의 포트를 함께 바꾼다 |
| `{"ok":false,"db":"down"}` | `pnpm db:up` 후 `docker compose ps`로 healthy 확인 |
| `환경변수 설정이 올바르지 않습니다` | `apps/api/.env`가 없다. 3번 단계 수행 |
| 타입 에러가 shared 변경 후 안 사라짐 | `pnpm --filter @gomingout/shared build` |
