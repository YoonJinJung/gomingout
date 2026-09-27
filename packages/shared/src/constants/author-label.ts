/**
 * 작성자 라벨 (PRD 4장, D22).
 *
 * 왜 상수인가:
 * 서버의 serializer(toPublicComment)가 만드는 문자열과 화면이 분기하는 문자열이
 * 반드시 같아야 한다. 한쪽만 바뀌면 "글쓴이" 배지가 조용히 일반 익명 배지로 보인다.
 */
export const AUTHOR_LABEL = {
  /** 게시글의 익명 작성자, 또는 번호가 필요 없는 익명 */
  anonymous: '익명',
  /** 게시글 작성자가 단 댓글. 글·댓글의 익명 여부와 무관하게 붙인다 (D22) */
  postAuthor: '글쓴이',
  /** 탈퇴한 사용자 (D18) */
  deleted: '탈퇴한 사용자',
} as const;

/**
 * 한 게시글 안에서만 유효한 익명 번호 라벨.
 * 번호는 AnonymousAlias가 게시글 단위로 고정한다. 다른 글에서는 같은 사람이 다른 번호를 받는다.
 */
export function anonymousNumberLabel(sequence: number): string {
  return `${AUTHOR_LABEL.anonymous}${String(sequence)}`;
}

/** 글쓴이 여부 판별. 라벨 문자열을 직접 비교하지 않기 위해 둔다. */
export function isPostAuthorLabel(label: string): boolean {
  return label === AUTHOR_LABEL.postAuthor;
}
