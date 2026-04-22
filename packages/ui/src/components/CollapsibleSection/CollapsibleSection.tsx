import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '../../lib/cn';

export interface CollapsibleSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  preview?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export const CollapsibleSection = React.forwardRef<HTMLDivElement, CollapsibleSectionProps>(
  (
    {
      label,
      preview,
      defaultOpen = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(defaultOpen);
    const bodyRef = useRef<HTMLDivElement>(null);
    const [maxHeight, setMaxHeight] = useState<string>(defaultOpen ? 'none' : '0px');

    const updateMaxHeight = useCallback(() => {
      if (bodyRef.current) {
        setMaxHeight(open ? `${bodyRef.current.scrollHeight}px` : '0px');
      }
    }, [open]);

    useEffect(() => {
      updateMaxHeight();
    }, [updateMaxHeight]);

    const toggle = () => setOpen((prev) => !prev);

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-stone-200 bg-white',
          className
        )}
        {...props}
      >
        <button
          type="button"
          onClick={toggle}
          className={cn(
            'flex w-full items-center justify-between px-4 py-3',
            'text-left transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-600/40',
            'hover:bg-stone-50',
            open ? 'rounded-t-xl' : 'rounded-xl'
          )}
          aria-expanded={open}
        >
          <span className="text-sm font-medium text-stone-900">{label}</span>
          <div className="flex items-center gap-2">
            {!open && preview && (
              <span className="text-sm text-stone-500">{preview}</span>
            )}
            <svg
              className={cn(
                'h-4 w-4 text-stone-400 transition-transform duration-300',
                open && 'rotate-180'
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        <div
          ref={bodyRef}
          style={{ maxHeight }}
          className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        >
          <div className="border-t border-stone-200 px-4 py-3">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

CollapsibleSection.displayName = 'CollapsibleSection';
