import React from 'react';
import { cn } from '../../lib/cn';

export interface ScriptSection {
  label: string;
  emoji: string;
  timing: string;
  content: string;
}

export interface ScriptPreviewCardProps extends React.HTMLAttributes<HTMLDivElement> {
  concept: string;
  duration: string;
  sections: ScriptSection[];
}

export const ScriptPreviewCard = React.forwardRef<HTMLDivElement, ScriptPreviewCardProps>(
  (
    {
      concept,
      duration,
      sections,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-6',
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-stone-900">{concept}</h3>
          <span className="inline-flex rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
            {duration}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {sections.map((section, index) => (
            <div key={index} className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm" aria-hidden="true">{section.emoji}</span>
                <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  {section.label}
                </span>
                <span className="text-xs text-stone-400">{section.timing}</span>
              </div>
              <p className="pl-6 text-sm text-stone-600">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

ScriptPreviewCard.displayName = 'ScriptPreviewCard';
