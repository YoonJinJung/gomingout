/**
 * ⚠️ M0 전용 mock 데이터. 실제 API(M1~M4)가 붙으면 이 폴더를 통째로 삭제한다.
 *
 * 왜 shared의 PublicPost / PublicComment 타입을 그대로 쓰는가:
 * mock이라도 "응답에 담길 수 있는 모양"을 벗어나지 않게 하려는 것이다.
 * 이 타입에는 authorId·nickname 같은 식별 정보를 담을 자리가 애초에 없으므로
 * (CLAUDE.md 절대규칙 1), mock 화면을 만들다가 익명 규칙을 어길 수 없다.
 * 나중에 실제 API로 갈아끼울 때 화면 코드를 고칠 필요도 없다.
 */
import type { MyProfile, PublicComment, PublicPost, PublicPostSummary } from '@gomingout/shared';

/** 로그인한 나 (M1까지는 이 값을 고정으로 쓴다) */
export const MOCK_ME: MyProfile = {
  id: 'mock-me',
  email: 'test@gomingout.local',
  nickname: '밤하늘',
  nicknameChangedAt: null,
  mbti: 'INFP',
  mbtiPublic: true,
  ageRange: 'TWENTIES_EARLY',
  ageRangePublic: false,
  gender: null,
  genderPublic: false,
  occupation: 'STUDENT',
  occupationPublic: true,
  bio: '조용히 듣는 편이에요.',
  bioPublic: true,
  role: 'USER',
  createdAt: '2026-08-01T12:00:00.000Z',
};

function iso(daysAgo: number, hoursAgo = 0): string {
  const base = Date.UTC(2026, 8, 28, 3, 0, 0); // 2026-09-28 12:00 KST
  return new Date(base - daysAgo * 86_400_000 - hoursAgo * 3_600_000).toISOString();
}

/** 게시글 상세용 (본문 전체) */
export const MOCK_POSTS: PublicPost[] = [
  {
    id: 'p1',
    category: { slug: 'burnout', name: '번아웃', parent: { slug: 'work', name: '직장' } },
    title: '아무것도 하고 싶지 않은 날이 길어져요',
    content:
      '출근은 하는데 자리에 앉으면 멍하니 화면만 봐요. 예전엔 일이 재미있었는데 지금은 아무 감정이 없어요.\n\n주말에 쉬어도 회복이 안 되고, 월요일이 오는 게 무섭습니다. 다들 이런 시기를 어떻게 넘기셨나요? 그만두는 게 답일까 싶다가도 막막해서 결정을 못 하고 있어요.',
    author: { type: 'anonymous', label: '익명', mbti: 'INFP' },
    likeCount: 42,
    commentCount: 3,
    scrapCount: 12,
    crisisFlag: false,
    blinded: false,
    createdAt: iso(0, 5),
    editedAt: null,
    viewer: { liked: true, scrapped: false, isMine: false },
  },
  {
    id: 'p2',
    category: {
      slug: 'self-esteem',
      name: '자존감',
      parent: { slug: 'mind', name: '마음' },
    },
    title: '남들과 비교하는 습관을 어떻게 끊었나요',
    content:
      'SNS를 보면 다들 저보다 앞서가는 것 같아서 마음이 무너져요. 앱을 지워도 며칠 못 가서 다시 깔고 있습니다.\n\n비교를 멈추는 게 마음먹기의 문제인지, 아니면 다른 방법이 있는 건지 궁금해요.',
    author: { type: 'nickname', nickname: '초승달', mbti: 'ENTP' },
    likeCount: 28,
    commentCount: 2,
    scrapCount: 7,
    crisisFlag: false,
    blinded: false,
    createdAt: iso(0, 9),
    editedAt: iso(0, 7),
    viewer: { liked: false, scrapped: true, isMine: false },
  },
  {
    id: 'p3',
    category: { slug: 'family', name: '가족', parent: { slug: 'relationship', name: '관계' } },
    title: '부모님께 진로를 말하지 못한 채 1년이 지났어요',
    content:
      '전공을 바꾸고 싶다는 말을 못 하고 있어요. 실망하실 게 뻔해서요.\n\n매번 통화할 때마다 잘 지낸다고만 하고 끊습니다. 이 거짓말이 길어질수록 더 말하기 어려워지는 것 같아요.',
    author: { type: 'anonymous', label: '익명', mbti: null },
    likeCount: 15,
    commentCount: 1,
    scrapCount: 3,
    crisisFlag: false,
    blinded: false,
    createdAt: iso(1),
    editedAt: null,
    viewer: { liked: false, scrapped: false, isMine: true },
  },
  {
    id: 'p4',
    category: {
      slug: 'depression',
      name: '우울',
      parent: { slug: 'mind', name: '마음' },
    },
    title: '요즘 계속 무기력해서 하루를 버티는 게 힘들어요',
    content:
      '몇 주째 잠도 잘 안 오고 아무것도 하기 싫어요. 가끔은 다 사라지고 싶다는 생각도 들어요.\n\n누구한테 말하기도 애매해서 여기에 적어봅니다. 이런 기분이 언제 끝날지 모르겠어요.',
    // crisisFlag가 true면 상세 하단에 상담 창구 안내 박스가 표시된다 (PRD 8장)
    author: { type: 'anonymous', label: '익명', mbti: 'ISFP' },
    likeCount: 9,
    commentCount: 2,
    scrapCount: 1,
    crisisFlag: true,
    blinded: false,
    createdAt: iso(1, 3),
    editedAt: null,
    viewer: { liked: false, scrapped: false, isMine: false },
  },
  {
    id: 'p5',
    category: { slug: 'crush', name: '짝사랑', parent: { slug: 'love', name: '연애' } },
    title: '고백하면 지금 관계도 끝날 것 같아서 못 하고 있어요',
    content: '3년을 친구로 지냈어요. 말하면 편했던 사이가 어색해질 것 같아 매번 삼킵니다.',
    author: { type: 'deleted' },
    likeCount: 33,
    commentCount: 0,
    scrapCount: 5,
    crisisFlag: false,
    blinded: false,
    createdAt: iso(2),
    editedAt: null,
    viewer: { liked: false, scrapped: false, isMine: false },
  },
  {
    id: 'p6',
    category: { slug: 'diet', name: '다이어트', parent: { slug: 'appearance', name: '외모' } },
    title: '체중은 줄었는데 거울을 보는 게 더 싫어졌어요',
    content: '목표 체중을 찍었는데도 만족이 안 돼요. 계속 다른 부분이 눈에 들어옵니다.',
    author: { type: 'nickname', nickname: '민트초코', mbti: null },
    likeCount: 21,
    commentCount: 1,
    scrapCount: 9,
    crisisFlag: false,
    blinded: false,
    createdAt: iso(3),
    editedAt: null,
    viewer: { liked: false, scrapped: false, isMine: false },
  },
];

/** 본문 미리보기(2줄)만 담은 피드용 축약형 — 실제 API도 목록에서는 이 형태를 보낸다. */
export function toSummary(post: PublicPost): PublicPostSummary {
  const { content, viewer: _viewer, ...rest } = post;
  return { ...rest, preview: content.replace(/\n+/g, ' ').slice(0, 120) };
}

export const MOCK_FEED: PublicPostSummary[] = MOCK_POSTS.map(toSummary);

/** 홈 인기글: 최근 72시간 상위 5 (PRD 7장) */
export const MOCK_HOT: PublicPostSummary[] = [MOCK_POSTS[0], MOCK_POSTS[1], MOCK_POSTS[3]]
  .filter((post): post is PublicPost => post !== undefined)
  .map(toSummary);

/**
 * 댓글. 익명 번호는 게시글 범위에서만 유지된다(PRD 4장).
 * 글쓴이가 익명으로 단 댓글은 label이 "글쓴이"다.
 */
export const MOCK_COMMENTS: PublicComment[] = [
  {
    id: 'c1',
    postId: 'p1',
    parentId: null,
    content:
      '저도 작년에 같았어요. 병가를 2주 냈는데 그때 처음으로 "쉬어도 되는구나" 싶었습니다. 혼자 버티지 마세요.',
    author: { type: 'anonymous', label: '익명1', mbti: 'ENFJ' },
    likeCount: 12,
    crisisFlag: false,
    blinded: false,
    createdAt: iso(0, 4),
    editedAt: null,
    viewer: { liked: true, isMine: false },
  },
  {
    id: 'c2',
    postId: 'p1',
    parentId: 'c1',
    content: '병가 내실 때 회사에 어떻게 말하셨는지 여쭤봐도 될까요?',
    author: { type: 'anonymous', label: '글쓴이', mbti: 'INFP' },
    likeCount: 2,
    crisisFlag: false,
    blinded: false,
    createdAt: iso(0, 3),
    editedAt: null,
    viewer: { liked: false, isMine: true },
  },
  {
    id: 'c3',
    postId: 'p1',
    parentId: null,
    content: '지금 당장 결정하지 않아도 괜찮아요. 결정할 힘이 남아 있을 때 정하는 게 맞습니다.',
    author: { type: 'nickname', nickname: '초승달', mbti: 'ENTP' },
    likeCount: 8,
    crisisFlag: false,
    blinded: false,
    createdAt: iso(0, 1),
    editedAt: null,
    viewer: { liked: false, isMine: false },
  },
  {
    id: 'c4',
    postId: 'p4',
    parentId: null,
    content:
      '저도 비슷한 시기를 지났어요. 그때 상담을 받아본 게 도움이 됐습니다. 지금 힘을 내라는 말보다, 그냥 곁에 있다고 말하고 싶어요.',
    author: { type: 'anonymous', label: '익명1', mbti: 'INFJ' },
    likeCount: 6,
    crisisFlag: false,
    blinded: false,
    createdAt: iso(1, 2),
    editedAt: null,
    viewer: { liked: false, isMine: false },
  },
  {
    id: 'c5',
    postId: 'p4',
    parentId: null,
    content: '잠이 안 오는 게 오래 가면 몸이 먼저 지치더라고요. 천천히, 하루에 하나씩만요.',
    author: { type: 'nickname', nickname: '민트초코', mbti: null },
    likeCount: 3,
    crisisFlag: false,
    blinded: false,
    createdAt: iso(1, 1),
    editedAt: null,
    viewer: { liked: false, isMine: false },
  },
];

/** 내가 쓴 댓글 (마이페이지) */
export const MOCK_MY_COMMENTS: PublicComment[] = MOCK_COMMENTS.filter(
  (comment) => comment.viewer?.isMine === true,
);
