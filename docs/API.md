# API 목록 (초안)

모든 경로는 `/api` 하위. 인증 필요 여부: 🔒 로그인, 🛡️ 어드민.
목록 API는 커서 기반: `?cursor=<id>&limit=20` → `{ items, nextCursor }`.

## Auth
| Method | Path | 설명 |
|---|---|---|
| POST | /auth/email/send-code | 인증 코드 발송 (purpose: SIGNUP / PASSWORD_RESET) |
| POST | /auth/email/verify | 코드 검증 → 단기 verification 토큰 발급 |
| POST | /auth/signup | 가입 (verification 토큰, 비밀번호, birthYear, 약관 동의, 프로필) |
| POST | /auth/login | 로그인 |
| POST | /auth/refresh | 토큰 갱신 |
| POST | /auth/logout 🔒 | 로그아웃 |
| POST | /auth/password/reset | 비밀번호 재설정 (verification 토큰 필요) |
| GET  | /auth/nickname-available?nickname= | 닉네임 중복 확인 |

## Users
| Method | Path | 설명 |
|---|---|---|
| GET | /users/me 🔒 | 내 정보 (전체 프로필 포함) |
| PATCH | /users/me/profile 🔒 | 프로필·공개 설정 수정 |
| PATCH | /users/me/password 🔒 | 비밀번호 변경 |
| DELETE | /users/me 🔒 | 탈퇴 |
| GET | /users/me/posts 🔒 | 내 글 (익명 글 포함) |
| GET | /users/me/comments 🔒 | 내 댓글 |
| GET | /users/me/scraps 🔒 | 스크랩 목록 |
| GET | /users/:nickname | 타인 프로필 (공개 항목만) |
| GET | /users/:nickname/posts | 타인의 닉네임 글 목록 (익명 글 제외) |

## Categories
| Method | Path | 설명 |
|---|---|---|
| GET | /categories | 대분류-소분류 트리 |

## Posts
| Method | Path | 설명 |
|---|---|---|
| GET | /posts?category=&sort=latest\|hot | 피드 (category는 대분류 또는 소분류 slug) |
| GET | /posts/hot-home | 홈 인기글 (72시간, 상위 5) |
| GET | /posts/:id | 상세 (viewer의 liked/scrapped/isMine 포함) |
| POST | /posts 🔒 | 작성 (isAnonymous, showMbti) |
| PATCH | /posts/:id 🔒 | 제목·본문 수정 |
| DELETE | /posts/:id 🔒 | 삭제 |
| POST / DELETE | /posts/:id/like 🔒 | 공감 / 취소 |
| POST / DELETE | /posts/:id/scrap 🔒 | 스크랩 / 취소 |

## Comments
| Method | Path | 설명 |
|---|---|---|
| GET | /posts/:id/comments | 댓글 목록 |
| POST | /posts/:id/comments 🔒 | 작성 (parentId 선택) |
| PATCH | /comments/:id 🔒 | 수정 |
| DELETE | /comments/:id 🔒 | 삭제 |

## Reports
| Method | Path | 설명 |
|---|---|---|
| POST | /reports 🔒 | 신고 (targetType, targetId, reason, detail) |

## Admin 🛡️
| Method | Path | 설명 |
|---|---|---|
| GET | /admin/reports?status= | 신고 목록 (대상별 묶음) |
| PATCH | /admin/reports/:id | 처리 (유지/삭제/기각) |
| PATCH | /admin/posts/:id/status | 게시글 상태 변경 |
| PATCH | /admin/comments/:id/status | 댓글 상태 변경 |
| PATCH | /admin/users/:id/status | 사용자 정지/해제 |

## 공개 응답 형태 (익명 보호)

> 실제 정의는 `packages/shared/src/types/api.ts`에 있다. 이 문서와 코드가 다르면 버그다.

```ts
type PublicAuthor =
  | { type: 'nickname';  nickname: string; mbti: Mbti | null } // mbti는 mbtiPublic일 때만
  | { type: 'anonymous'; label: string;    mbti: Mbti | null } // label: "익명" | "익명3" | "글쓴이"
  | { type: 'deleted' };                                        // 탈퇴한 사용자 (D18)

type PublicPost = {
  id: string; category: { slug: string; name: string; parent: { slug: string; name: string } };
  title: string; content: string; author: PublicAuthor;
  likeCount: number; commentCount: number; scrapCount: number;
  crisisFlag: boolean; blinded: boolean;
  createdAt: string; editedAt: string | null;
  viewer?: { liked: boolean; scrapped: boolean; isMine: boolean };
};

// 목록(피드)에서는 본문 전체 대신 미리보기만 보낸다
type PublicPostSummary = Omit<PublicPost, 'content' | 'viewer'> & { preview: string };

type PublicComment = {
  id: string; postId: string; parentId: string | null; // 대댓글 1단계 (D18)
  content: string; author: PublicAuthor;
  likeCount: number; crisisFlag: boolean; blinded: boolean;
  createdAt: string; editedAt: string | null;
  viewer?: { liked: boolean; isMine: boolean };
};

type CursorPage<T> = { items: T[]; nextCursor: string | null };
```

### 지켜야 할 것

- 익명 author에는 id·nickname을 절대 포함하지 않는다.
- 모든 응답은 serializer(`toPublicPost`·`toPublicComment`)를 거친다. Prisma 결과 직접 반환 금지.
- 응답 헤더는 전역으로 `Cache-Control: private, no-store`다.
  `viewer` 필드가 캐시를 통해 다른 사용자에게 새면 익명 글의 작성자가 특정될 수 있다.
- 어드민 신고 처리 API만 예외적으로 작성자를 다룬다(PRD 4장).
