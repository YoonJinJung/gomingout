# DB 스키마 초안 (Prisma)

> 초안이다. 미결 사항(대댓글, 댓글 공감 등) 확정 후 조정.

```prisma
enum Role { USER ADMIN }
enum UserStatus { ACTIVE SUSPENDED DELETED }
enum ContentStatus { ACTIVE BLINDED DELETED }
enum ReportTarget { POST COMMENT }
enum ReportReason { ABUSE SPAM SEXUAL PRIVACY SELF_HARM OTHER }
enum ReportStatus { PENDING RESOLVED_KEPT RESOLVED_REMOVED DISMISSED }
enum AgeRange { TEEN_LATE TWENTIES_EARLY TWENTIES_LATE THIRTIES FORTIES_PLUS }
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
  nicknameChangedAt  DateTime?
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

  posts     Post[]
  comments  Comment[]
  likes     PostLike[]
  scraps    Scrap[]
  reports   Report[]   @relation("Reporter")
  sessions  Session[]
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
  parentId     String?                            // 대댓글(1단계), 미결 확정 후 유지/삭제
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
  deletedAt    DateTime?

  @@index([postId, createdAt])
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

// 댓글 공감 확정 시 CommentLike 추가

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
  purpose   String                 // SIGNUP | PASSWORD_RESET
  codeHash  String
  attempts  Int      @default(0)
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime @default(now())
  @@index([email, purpose])
}

model Session {
  id               String    @id @default(cuid())
  userId           String
  user             User      @relation(fields: [userId], references: [id])
  refreshTokenHash String    @unique
  expiresAt        DateTime
  revokedAt        DateTime?
  createdAt        DateTime  @default(now())
}
```

## 확장 대비 메모
- 쪽지: `Conversation`, `ConversationMember`, `Message` 테이블로 추가 예정. 익명 글 작성자에게 쪽지를 보낼 경우 상대 신원을 노출하지 않는 구조 필요.
- 알림: `Notification(userId, type, payload JSON, readAt)` 형태로 추가 예정.
