# DB 스키마 초안 (Prisma)

> 대댓글 1단계·댓글 공감은 D18·D23으로 확정되어 반영했다.
> 모델은 마일스톤 순서대로 `apps/api/prisma/schema.prisma`에 옮겨 마이그레이션으로 만든다.
> 구현이 이 문서와 달라지면 같은 커밋에서 문서를 고친다.

```prisma
enum Role { USER ADMIN SUPER_ADMIN } // 권한 분기는 M5에서 (D26)
enum UserStatus { ACTIVE SUSPENDED DELETED }
enum ContentStatus { ACTIVE BLINDED DELETED }
enum ReportTarget { POST COMMENT }
enum ReportReason { ABUSE SPAM SEXUAL PRIVACY SELF_HARM OTHER }
enum ReportStatus { PENDING RESOLVED_KEPT RESOLVED_REMOVED DISMISSED }
enum VerificationPurpose { SIGNUP PASSWORD_RESET }
enum AgeRange { TEEN_MID TEEN_LATE TWENTIES_EARLY TWENTIES_LATE THIRTIES FORTIES_PLUS } // TEEN_MID(14~16)는 가입 하한(D6)을 담는 구간
enum Gender { MALE FEMALE OTHER }
enum Occupation { STUDENT JOB_SEEKER EMPLOYEE SELF_EMPLOYED OTHER }

model User {
  id              String     @id @default(cuid())
  email           String?    @unique            // 탈퇴 시 null 처리
  passwordHash    String?
  emailVerifiedAt DateTime?
  birthYear       Int                            // 만 14세 확인용, 외부 노출 금지
  role            Role       @default(USER)
  status          UserStatus @default(ACTIVE)
  termsAgreedAt   DateTime
  createdAt       DateTime   @default(now())
  deletedAt       DateTime?

  nickname           String   @unique
  // 변경 이력은 NicknameChange가 관리한다 (D25). 여기에 마지막 시각을 두면 7일 2회를 셀 수 없다
  mbti               String                      // "INFP" 등, shared 상수로 검증
  mbtiPublic         Boolean  @default(true)
  ageRange           AgeRange?
  ageRangePublic     Boolean  @default(false)
  gender             Gender?
  genderPublic       Boolean  @default(false)
  occupation         Occupation?
  occupationPublic   Boolean  @default(false)
  bio                String?  @db.VarChar(100)
  bioPublic          Boolean  @default(false)

  posts           Post[]
  comments        Comment[]
  nicknameChanges NicknameChange[]
  likes        PostLike[]
  commentLikes CommentLike[]
  scraps       Scrap[]
  reports      Report[]   @relation("Reporter")
  sessions     Session[]
}

model Category {
  id        Int        @id @default(autoincrement())
  parentId  Int?
  parent    Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children  Category[] @relation("CategoryTree")
  name      String
  slug      String     @unique
  order     Int        @default(0)
  posts     Post[]
}

model Post {
  id           String        @id @default(cuid())
  authorId     String
  author       User          @relation(fields: [authorId], references: [id])
  categoryId   Int                                // 소분류만 허용
  category     Category      @relation(fields: [categoryId], references: [id])
  title        String        @db.VarChar(100)
  content      String        @db.Text
  isAnonymous  Boolean
  showMbti     Boolean       @default(true)
  mbtiSnapshot String?                            // 익명+showMbti일 때 작성 시점 MBTI
  crisisFlag   Boolean       @default(false)
  likeCount    Int           @default(0)
  commentCount Int           @default(0)
  scrapCount   Int           @default(0)
  reportCount  Int           @default(0)
  status       ContentStatus @default(ACTIVE)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  editedAt     DateTime?
  deletedAt    DateTime?

  comments     Comment[]
  likes        PostLike[]
  scraps       Scrap[]
  aliases      AnonymousAlias[]

  @@index([categoryId, createdAt])
  @@index([createdAt])
}

model Comment {
  id           String        @id @default(cuid())
  postId       String
  post         Post          @relation(fields: [postId], references: [id])
  authorId     String
  author       User          @relation(fields: [authorId], references: [id])
  parentId     String?                            // 대댓글 1단계 (D18). 대댓글에는 다시 답글을 달 수 없다
  parent       Comment?      @relation("Replies", fields: [parentId], references: [id])
  replies      Comment[]     @relation("Replies")
  content      String        @db.VarChar(1000)
  isAnonymous  Boolean
  showMbti     Boolean       @default(true)
  mbtiSnapshot String?
  crisisFlag   Boolean       @default(false)
  likeCount    Int           @default(0)
  reportCount  Int           @default(0)
  status       ContentStatus @default(ACTIVE)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  editedAt     DateTime?                          // 수정 시에만 기록. "수정됨" 표시용
  deletedAt    DateTime?

  likes        CommentLike[]

  @@index([postId, createdAt])
  @@index([parentId])
}

// 게시글 내 익명 번호 고정용. 글쓴이는 number=0으로 "글쓴이" 표시
model AnonymousAlias {
  postId  String
  post    Post   @relation(fields: [postId], references: [id])
  userId  String
  number  Int
  @@id([postId, userId])
  @@unique([postId, number])
}

model PostLike {
  userId    String
  postId    String
  user      User     @relation(fields: [userId], references: [id])
  post      Post     @relation(fields: [postId], references: [id])
  createdAt DateTime @default(now())
  @@id([userId, postId])
}

// 댓글 공감 (D18, D23). PostLike와 같은 복합 PK 구조로 중복 공감을 DB에서 막는다.
model CommentLike {
  userId    String
  commentId String
  user      User     @relation(fields: [userId], references: [id])
  comment   Comment  @relation(fields: [commentId], references: [id])
  createdAt DateTime @default(now())
  @@id([userId, commentId])
  @@index([commentId])
}

model Scrap {
  userId    String
  postId    String
  user      User     @relation(fields: [userId], references: [id])
  post      Post     @relation(fields: [postId], references: [id])
  createdAt DateTime @default(now())
  @@id([userId, postId])
}

model Report {
  id          String       @id @default(cuid())
  reporterId  String
  reporter    User         @relation("Reporter", fields: [reporterId], references: [id])
  targetType  ReportTarget
  targetId    String
  reason      ReportReason
  detail      String?      @db.VarChar(300)
  status      ReportStatus @default(PENDING)
  handledById String?
  handledAt   DateTime?
  createdAt   DateTime     @default(now())
  @@unique([reporterId, targetType, targetId])
  @@index([status, createdAt])
}

model EmailVerification {
  id        String   @id @default(cuid())
  email     String
  purpose   VerificationPurpose
  codeHash  String
  attempts  Int      @default(0)
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime @default(now())
  @@index([email, purpose])
}

// 닉네임 변경 이력 (D25). 7일 동안 2회 제한을 판정하고, 운영 시 변경 내역을 확인한다.
model NicknameChange {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  from      String
  to        String
  createdAt DateTime @default(now())
  // "최근 7일 내 몇 번 바꿨나"를 바로 세기 위한 인덱스
  @@index([userId, createdAt])
}

// refresh token 세션 (D27). access token은 상태를 두지 않는다.
model Session {
  id               String    @id @default(cuid())
  userId           String
  user             User      @relation(fields: [userId], references: [id])
  // 평문을 저장하지 않는다. DB가 유출돼도 토큰을 그대로 쓸 수 없게 한다.
  refreshTokenHash String    @unique
  expiresAt        DateTime
  revokedAt        DateTime?
  // 회전(rotation): 갱신할 때마다 새 세션을 만들고 이전 것을 여기로 연결한다.
  // 이미 회전된(=사용된) 토큰이 다시 들어오면 탈취로 보고 해당 사용자의 세션을 전부 끊는다.
  rotatedToId      String?   @unique
  createdAt        DateTime  @default(now())

  @@index([userId])
}
```

## 확장 대비 메모
- 쪽지: `Conversation`, `ConversationMember`, `Message` 테이블로 추가 예정. 익명 글 작성자에게 쪽지를 보낼 경우 상대 신원을 노출하지 않는 구조 필요.
- 알림: `Notification(userId, type, payload JSON, readAt)` 형태로 추가 예정.
