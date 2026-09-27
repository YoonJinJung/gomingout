/**
 * 카테고리 시드 (PRD 6장, D10). 대분류-소분류 2단계.
 * 게시글은 소분류에만 연결된다(SCHEMA.md Post.categoryId 주석).
 * slug는 URL과 API 파라미터로 쓰이므로 변경 시 링크가 깨진다.
 */

export type CategorySeedChild = {
  readonly slug: string;
  readonly name: string;
};

export type CategorySeedParent = {
  readonly slug: string;
  readonly name: string;
  readonly children: readonly CategorySeedChild[];
};

export const CATEGORY_SEED: readonly CategorySeedParent[] = [
  {
    slug: 'love',
    name: '연애',
    children: [
      { slug: 'crush', name: '짝사랑' },
      { slug: 'dating', name: '연애 중' },
      { slug: 'breakup', name: '이별' },
    ],
  },
  {
    slug: 'relationship',
    name: '관계',
    children: [
      { slug: 'family', name: '가족' },
      { slug: 'friend', name: '친구' },
      { slug: 'coworker', name: '직장 동료' },
    ],
  },
  {
    slug: 'career',
    name: '진로',
    children: [
      { slug: 'study', name: '학업' },
      { slug: 'job-hunting', name: '취업' },
      { slug: 'job-change', name: '이직' },
    ],
  },
  {
    slug: 'work',
    name: '직장',
    children: [
      { slug: 'work-task', name: '업무' },
      { slug: 'burnout', name: '번아웃' },
    ],
  },
  {
    slug: 'mind',
    name: '마음',
    children: [
      { slug: 'depression', name: '우울' },
      { slug: 'anxiety', name: '불안' },
      { slug: 'self-esteem', name: '자존감' },
    ],
  },
  {
    slug: 'appearance',
    name: '외모',
    children: [
      { slug: 'diet', name: '다이어트' },
      { slug: 'skin-hair', name: '피부·헤어' },
      { slug: 'body-health', name: '건강' },
    ],
  },
  {
    slug: 'money',
    name: '돈',
    children: [
      { slug: 'living-cost', name: '생활비' },
      { slug: 'debt', name: '빚' },
      { slug: 'investment', name: '재테크' },
    ],
  },
  {
    slug: 'daily',
    name: '일상',
    children: [
      { slug: 'small-talk', name: '잡담' },
      { slug: 'etc', name: '기타' },
    ],
  },
];

/** 모든 slug(대분류+소분류)를 평탄화. 피드의 category 파라미터 검증에 사용한다. */
export const ALL_CATEGORY_SLUGS: readonly string[] = CATEGORY_SEED.flatMap((parent) => [
  parent.slug,
  ...parent.children.map((child) => child.slug),
]);

/** 게시글을 연결할 수 있는 소분류 slug만. */
export const LEAF_CATEGORY_SLUGS: readonly string[] = CATEGORY_SEED.flatMap((parent) =>
  parent.children.map((child) => child.slug),
);
