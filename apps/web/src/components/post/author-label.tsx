import { AUTHOR_LABEL, isPostAuthorLabel, type PublicAuthor } from '@gomingout/shared';
import { MbtiBadge } from './mbti-badge';

/**
 * 작성자 표시 (DESIGN.md 7장).
 *
 * 익명성 규칙이 화면에 드러나는 지점이다(CLAUDE.md 절대규칙 1·2):
 * - 입력 타입이 PublicAuthor이므로 authorId·nickname을 받을 자리가 익명 분기에 아예 없다.
 * - 익명 글·댓글에 표시할 수 있는 프로필 정보는 MBTI 스냅샷뿐이다.
 * - 닉네임 작성자의 MBTI는 mbtiPublic=true일 때만 서버가 채워 보낸다(절대규칙 4).
 * - 탈퇴한 사용자는 닉네임을 노출하지 않고 "탈퇴한 사용자"로만 표시한다(D18).
 *
 * `글쓴이` 라벨은 글·댓글의 익명 여부와 무관하게 붙는다(D22).
 * 닉네임 글에 익명 댓글을 달면 작성자가 드러나지만 의도된 동작이며,
 * 이 경우에도 응답에 nickname·id는 담기지 않는다 — 라벨만 바뀐다.
 */
export function AuthorLabel({ author }: { author: PublicAuthor }) {
  if (author.type === 'deleted') {
    return <span className="text-caption text-text-subtle">{AUTHOR_LABEL.deleted}</span>;
  }

  if (author.type === 'anonymous') {
    // 글쓴이 배지는 강조색, 일반 익명 배지는 익명 전용 색 (DESIGN.md 7장)
    const isAuthor = isPostAuthorLabel(author.label);
    return (
      <span className="flex items-center gap-1.5">
        <span
          className={
            isAuthor
              ? 'rounded-pill bg-primary-soft px-2 py-0.5 text-caption text-primary'
              : 'rounded-pill bg-anon-bg px-2 py-0.5 text-caption text-anon-text'
          }
        >
          {author.label}
        </span>
        {author.mbti !== null && <MbtiBadge mbti={author.mbti} />}
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1.5">
      <span className="text-caption text-text">{author.nickname}</span>
      {author.mbti !== null && <MbtiBadge mbti={author.mbti} />}
    </span>
  );
}
