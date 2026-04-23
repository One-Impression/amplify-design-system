import React from 'react';
import { cn } from '../../lib/cn';

export interface FlexiSelectorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onToggle'> {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
  multi?: boolean;
}

export const FlexiSelector = React.forwardRef<HTMLDivElement, FlexiSelectorProps>(
  ({ options, selected, onToggle, multi = false, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role={multi ? 'group' : 'radiogroup'}
        className={cn('flex flex-wrap gap-2', className)}
        {...props}
      >
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              role={multi ? 'checkbox' : 'radio'}
              aria-checked={isSelected}
              onClick={() => onToggle(option)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-xs font-medium',
                'transition-all duration-150',
                isSelected
                  ? 'border-violet-600 bg-violet-50 text-violet-700'
                  : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    );
  }
);

FlexiSelector.displayName = 'FlexiSelector';
