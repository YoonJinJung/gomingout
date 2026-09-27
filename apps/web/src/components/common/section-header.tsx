import type { ReactNode } from 'react';

export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <h2 className="text-title-sm text-text">{title}</h2>
      {action}
    </div>
  );
}
