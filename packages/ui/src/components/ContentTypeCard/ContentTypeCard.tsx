import React from 'react';
import { cn } from '../../lib/cn';

export type ContentTypeCardBadgeColor = 'violet' | 'green';

export interface ContentTypeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  badge: string;
  badgeColor?: ContentTypeCardBadgeColor;
  title: string;
  price: string;
  pros: string[];
  cancelPolicy?: string;
  recommended?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

const badgeColorClasses: Record<ContentTypeCardBadgeColor, string> = {
  violet: 'bg-violet-100 text-violet-700',
  green: 'bg-emerald-100 text-emerald-700',
};

export const ContentTypeCard = React.forwardRef<HTMLDivElement, ContentTypeCardProps>(
  (
    {
      badge,
      badgeColor = 'violet',
      title,
      price,
      pros,
      cancelPolicy,
      recommended = false,
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
          'relative flex flex-col gap-4 rounded-xl border p-6',
          'cursor-pointer transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-600/40',
          selected
            ? 'border-violet-600 bg-violet-50'
            : 'border-stone-200 bg-white hover:shadow-lg',
          className
        )}
        {...props}
      >
        {recommended && (
          <span className="absolute -top-2.5 right-4 inline-flex rounded-full bg-violet-600 px-2.5 py-0.5 text-xs font-medium text-white">
            Recommended
          </span>
        )}

        <span
          className={cn(
            'inline-flex self-start rounded-full px-2.5 py-0.5 text-xs font-medium',
            badgeColorClasses[badgeColor]
          )}
        >
          {badge}
        </span>

        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold text-stone-900">{title}</h3>
          <p className="text-sm text-stone-500">{price}</p>
        </div>

        <ul className="flex flex-col gap-2">
          {pros.map((pro, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-stone-600">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {pro}
            </li>
          ))}
        </ul>

        {cancelPolicy && (
          <p className="text-xs text-stone-400">{cancelPolicy}</p>
        )}
      </div>
    );
  }
);

ContentTypeCard.displayName = 'ContentTypeCard';
