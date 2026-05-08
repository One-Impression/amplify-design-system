import React from 'react';
import { cn } from '../../lib/cn';
import { Card } from '../Card';

/**
 * GoalCard — opinionated preset wrapper around `<Card>` for vertical
 * "icon + title + subtitle + tag" tiles used in goal pickers / segmentation.
 *
 * Backward-compatible: existing public props are preserved exactly.
 * Migration hint: see `component-status.json` (`replacedBy: "Card"`).
 */

export type GoalCardTagColor = 'violet' | 'green' | 'amber' | 'blue';

export interface GoalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: string;
  title: string;
  subtitle: string;
  tag: string;
  tagColor?: GoalCardTagColor;
  selected?: boolean;
  onSelect?: () => void;
}

const tagColorClasses: Record<GoalCardTagColor, string> = {
  violet: 'bg-violet-100 text-violet-700',
  green: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700',
  blue: 'bg-blue-100 text-blue-700',
};

export const GoalCard = React.forwardRef<HTMLDivElement, GoalCardProps>(
  (
    {
      icon,
      title,
      subtitle,
      tag,
      tagColor = 'violet',
      selected = false,
      onSelect,
      className,
      ...props
    },
    ref,
  ) => {
    const selectionClasses = selected
      ? 'border-violet-600 bg-violet-50 shadow-[0_0_0_1px_rgba(101,49,255,0.3)]'
      : 'border-stone-200 bg-white hover:shadow-lg';

    return (
      <Card
        ref={ref as React.Ref<HTMLElement>}
        variant="default"
        padding="comfortable"
        onClick={onSelect}
        aria-pressed={selected}
        className={cn(
          'flex flex-col items-center gap-3 rounded-xl text-center transition-all duration-200',
          selectionClasses,
          className,
        )}
        {...props}
      >
        <span className="text-3xl" aria-hidden="true">
          {icon}
        </span>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
          <p className="text-xs text-stone-500">{subtitle}</p>
        </div>
        <span
          className={cn(
            'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
            tagColorClasses[tagColor],
          )}
        >
          {tag}
        </span>
      </Card>
    );
  },
);

GoalCard.displayName = 'GoalCard';
