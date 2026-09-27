'use client';

import { CATEGORY_SEED, LIMITS, detectCrisisKeyword } from '@gomingout/shared';
import { useState } from 'react';
import { CareBox } from '@/components/common/care-box';
import { Card } from '@/components/common/card';
import { cn } from '@/lib/utils';

/**
 * 글쓰기 (PRD 9장, DESIGN.md 7장).
 *
 * 익명 기본 ON (D16). MBTI 표시 토글은 익명 ON일 때만 보인다.
 * 위기 키워드가 감지되면 안내를 보여주되 작성을 막지 않는다 (PRD 8장).
 * 실제 저장은 M2에서 붙인다.
 */
export default function WritePage() {
  const [categorySlug, setCategorySlug] = useState<string>('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [showMbti, setShowMbti] = useState(true);

  const crisisDetected = detectCrisisKeyword(`${title} ${content}`);
  const canSubmit = categorySlug !== '' && title.trim() !== '' && content.trim() !== '';

  return (
    <div className="space-y-4">
      <h1 className="px-1 text-title-lg text-text">이야기 들려주세요</h1>

      <Card className="space-y-4 p-4">
        <label className="block">
          <span className="text-caption text-text-muted">카테고리</span>
          <select
            value={categorySlug}
            onChange={(event) => {
              setCategorySlug(event.target.value);
            }}
            className="mt-1 min-h-12 w-full rounded-control bg-surface-2 px-3 text-text"
          >
            <option value="">선택해 주세요</option>
            {CATEGORY_SEED.map((parent) => (
              <optgroup key={parent.slug} label={parent.name}>
                {parent.children.map((child) => (
                  <option key={child.slug} value={child.slug}>
                    {child.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-caption text-text-muted">제목</span>
          <input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
            maxLength={LIMITS.postTitle.max}
            placeholder="어떤 고민인지 한 줄로 적어주세요"
            className="mt-1 min-h-12 w-full rounded-control bg-surface-2 px-3 text-text"
          />
        </label>

        <label className="block">
          <span className="text-caption text-text-muted">내용</span>
          <textarea
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
            }}
            maxLength={LIMITS.postContent.max}
            rows={8}
            placeholder="편하게 적어주세요. 천천히 들을게요."
            className="mt-1 w-full rounded-control bg-surface-2 p-3 text-body text-text"
          />
          <span className="mt-1 block text-right text-caption text-text-subtle">
            {content.length} / {LIMITS.postContent.max}
          </span>
        </label>
      </Card>

      {crisisDetected && <CareBox />}

      <Card className="divide-y">
        <Toggle
          label="익명으로 쓰기"
          description="작성 후에는 바꿀 수 없어요."
          checked={isAnonymous}
          onChange={setIsAnonymous}
        />
        {/* MBTI 표시 토글은 익명 ON일 때만 보인다 (DESIGN.md 7장) */}
        {isAnonymous && (
          <Toggle
            label="MBTI 표시"
            description="익명이어도 MBTI는 보여줄 수 있어요."
            checked={showMbti}
            onChange={setShowMbti}
          />
        )}
      </Card>

      <button
        type="button"
        disabled={!canSubmit}
        className="min-h-12 w-full rounded-control bg-primary text-body-sm font-semibold text-on-primary transition-colors duration-150 hover:bg-primary-strong disabled:bg-surface-2 disabled:text-text-subtle"
      >
        들려주기
      </button>
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <span>
        <span className="block text-body-sm text-text">{label}</span>
        <span className="block text-caption text-text-muted">{description}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => {
          onChange(!checked);
        }}
        className={cn(
          'relative h-7 w-12 shrink-0 rounded-pill transition-colors duration-150',
          checked ? 'bg-primary' : 'bg-surface-2',
        )}
      >
        <span
          className={cn(
            'absolute top-1 size-5 rounded-pill transition-all duration-150',
            checked ? 'left-6 bg-on-primary' : 'left-1 bg-text-subtle',
          )}
        />
      </button>
    </div>
  );
}
