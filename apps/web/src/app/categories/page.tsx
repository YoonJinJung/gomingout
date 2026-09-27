import { CATEGORY_SEED } from '@gomingout/shared';
import Link from 'next/link';
import { Card } from '@/components/common/card';

export const metadata = { title: '카테고리' };

/** 카테고리 목록 (PRD 9장). 대분류-소분류 2단계 (D10). */
export default function CategoriesPage() {
  return (
    <div className="space-y-4">
      <h1 className="px-1 text-title-lg text-text">카테고리</h1>

      {CATEGORY_SEED.map((parent) => (
        <Card key={parent.slug} className="px-4 py-4">
          <h2 className="text-title-sm text-text">{parent.name}</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {parent.children.map((child) => (
              <li key={child.slug}>
                <Link
                  href={`/categories/${child.slug}`}
                  className="flex min-h-11 items-center rounded-pill bg-surface-2 px-3 text-body-sm text-text-muted transition-colors duration-150 hover:text-text"
                >
                  {child.name}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
