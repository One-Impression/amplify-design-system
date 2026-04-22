import React, { useState } from 'react';
import { cn } from '../../lib/cn';

export interface FlexiOption {
  label: string;
  subtitle?: string;
  price?: string;
}

export interface FlexiSelectorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  defaultLabel: string;
  defaultDescription: string;
  options: FlexiOption[];
  onSelect?: (index: number | null) => void;
  expandLabel?: string;
}

export const FlexiSelector = React.forwardRef<HTMLDivElement, FlexiSelectorProps>(
  (
    {
      defaultLabel,
      defaultDescription,
      options,
      onSelect,
      expandLabel = 'Pick specific?',
      className,
      ...props
    },
    ref
  ) => {
    const [expanded, setExpanded] = useState(false);
    const [selected, setSelected] = useState<number | null>(null);

    const isFlexible = selected === null;

    const handleFlexibleClick = () => {
      setSelected(null);
      setExpanded(false);
      onSelect?.(null);
    };

    const handleOptionClick = (index: number) => {
      setSelected(index);
      onSelect?.(index);
    };

    const handleExpandClick = () => {
      setExpanded(true);
    };

    return (
      <div ref={ref} className={cn('flex flex-col gap-3', className)} {...props}>
        {/* Default flexible card */}
        <button
          type="button"
          onClick={handleFlexibleClick}
          className={cn(
            'w-full rounded-lg border-2 px-4 py-3 text-left transition-all duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600/40 focus-visible:ring-offset-2',
            isFlexible
              ? 'border-violet-600 bg-violet-50'
              : 'border-stone-200 bg-white hover:bg-stone-50'
          )}
        >
          <span className="block text-sm font-medium text-stone-900">
            {defaultLabel}
          </span>
          <span className="block text-xs text-stone-500 mt-0.5">
            {defaultDescription}
          </span>
        </button>

        {/* Expand link */}
        {!expanded && (
          <button
            type="button"
            onClick={handleExpandClick}
            className="self-start text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
          >
            {expandLabel}
          </button>
        )}

        {/* Option cards grid */}
        {expanded && (
          <div className="grid grid-cols-3 gap-3">
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleOptionClick(index)}
                className={cn(
                  'flex flex-col rounded-lg border-2 px-3 py-3 text-left transition-all duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600/40 focus-visible:ring-offset-2',
                  selected === index
                    ? 'border-violet-600 bg-violet-50'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                )}
              >
                <span className="text-sm font-medium text-stone-900">
                  {option.label}
                </span>
                {option.subtitle && (
                  <span className="text-xs text-stone-500 mt-0.5">
                    {option.subtitle}
                  </span>
                )}
                {option.price && (
                  <span className="text-xs font-medium text-violet-600 mt-1">
                    {option.price}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

FlexiSelector.displayName = 'FlexiSelector';
