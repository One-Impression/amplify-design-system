import React from 'react';
import { cn } from '../../lib/cn';

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
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect?.();
          }
        }}
        className={cn(
          'flex flex-col items-center gap-3 rounded-xl border p-6 text-center',
          'cursor-pointer transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-600/40',
          selected
            ? 'border-violet-600 bg-violet-50 shadow-[0_0_0_1px_rgba(101,49,255,0.3)]'
            : 'border-stone-200 bg-white hover:shadow-lg',
          className
        )}
        {...props}
      >
        <span className="text-3xl" aria-hidden="true">{icon}</span>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
          <p className="text-xs text-stone-500">{subtitle}</p>
        </div>
        <span
          className={cn(
            'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
            tagColorClasses[tagColor]
          )}
        >
          {tag}
        </span>
      </div>
    );
  }
);

GoalCard.displayName = 'GoalCard';
