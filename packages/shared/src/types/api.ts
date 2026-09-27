import type { Mbti } from '../constants/mbti.js';
import type { AgeRange, Gender, Occupation } from '../constants/profile-enums.js';

/**
 * ===== 익명 보호 응답 타입 (CLAUDE.md 절대규칙 1·2) =====
 *
 * 이 타입들이 API 응답의 유일한 형태다. Prisma 결과를 그대로 반환하는 것은 금지이며,
 * 반드시 toPublicPost / toPublicComment serializer를 거친다.
 *
 * 왜 타입으로 못 박는가:
 * authorId·nickname·email 같은 식별 정보를 담을 "자리 자체가 없게" 만들어,
 * 실수로 스프레드(...post)를 해도 타입 에러로 걸리게 하기 위해서다.
 */

/** 닉네임 글·댓글의 작성자 */
export type PublicAuthorNickname = {
  type: 'nickname';
  nickname: string;
  /** mbtiPublic=true일 때만 채운다 (절대규칙 4) */
  mbti: Mbti | null;
};

/**
 * 익명 글·댓글의 작성자.
 * id·nickname을 절대 포함하지 않는다. 노출 가능한 프로필 정보는 MBTI 스냅샷뿐이다(절대규칙 2).
 */
export type PublicAuthorAnonymous = {
  type: 'anonymous';
  /** "익명" | "익명3" | "글쓴이" — 게시글 범위에서만 유효한 라벨 */
  label: string;
  /** 작성 시점 스냅샷. showMbti=false면 null */
  mbti: Mbti | null;
};

/** 탈퇴한 사용자의 닉네임 글·댓글 (D18: 글은 남기고 "탈퇴한 사용자"로 표시) */
export type PublicAuthorDeleted = {
  type: 'deleted';
};

export type PublicAuthor = PublicAuthorNickname | PublicAuthorAnonymous | PublicAuthorDeleted;

export type PublicCategory = {
  slug: string;
  name: string;
  /** 대분류 */
  parent: { slug: string; name: string };
};

/** 로그인한 사용자 기준 상태. 응답 캐시 금지(Cache-Control: private, no-store). */
export type ViewerPostState = {
  liked: boolean;
  scrapped: boolean;
  isMine: boolean;
};

export type ViewerCommentState = {
  liked: boolean;
  isMine: boolean;
};

export type PublicPost = {
  id: string;
  category: PublicCategory;
  title: string;
  content: string;
  author: PublicAuthor;
  likeCount: number;
  commentCount: number;
  scrapCount: number;
  crisisFlag: boolean;
  /** 신고 누적으로 블라인드된 글. true면 본문을 가린다. */
  blinded: boolean;
  /** ISO 8601 UTC. 화면에서 KST로 표시한다. */
  createdAt: string;
  editedAt: string | null;
  viewer?: ViewerPostState;
};

/** 피드·목록용 축약형. content 전체 대신 미리보기만 보낸다. */
export type PublicPostSummary = Omit<PublicPost, 'content' | 'viewer'> & {
  /** 본문 2줄 미리보기 (DESIGN.md 7장 PostCard) */
  preview: string;
};

export type PublicComment = {
  id: string;
  postId: string;
  /** 1단계 대댓글 (D18). 최상위 댓글은 null */
  parentId: string | null;
  content: string;
  author: PublicAuthor;
  likeCount: number;
  crisisFlag: boolean;
  blinded: boolean;
  createdAt: string;
  editedAt: string | null;
  viewer?: ViewerCommentState;
};

/** 타인 프로필. *Public=false인 항목은 아예 키를 포함하지 않는다(절대규칙 4). */
export type PublicProfile = {
  nickname: string;
  mbti?: Mbti;
  ageRange?: AgeRange;
  gender?: Gender;
  occupation?: Occupation;
  bio?: string;
  createdAt: string;
};

/** 내 정보. 본인에게만 반환하므로 비공개 항목과 공개 설정을 함께 담는다. */
export type MyProfile = {
  id: string;
  email: string;
  nickname: string;
  nicknameChangedAt: string | null;
  mbti: Mbti;
  mbtiPublic: boolean;
  ageRange: AgeRange | null;
  ageRangePublic: boolean;
  gender: Gender | null;
  genderPublic: boolean;
  occupation: Occupation | null;
  occupationPublic: boolean;
  bio: string | null;
  bioPublic: boolean;
  role: 'USER' | 'ADMIN';
  createdAt: string;
};

/** 커서 기반 목록 응답 (API.md) */
export type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
};
