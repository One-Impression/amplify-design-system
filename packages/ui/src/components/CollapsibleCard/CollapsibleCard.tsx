import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/cn';

export interface CollapsibleCardProps {
  /** Content always visible (the clickable header) */
  header: React.ReactNode;
  /** Content shown when expanded */
  children: React.ReactNode;
  /** Controlled mode: externally managed open state */
  open?: boolean;
  /** Default open state (uncontrolled mode) */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
  header,
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  className,
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(defaultOpen ? undefined : 0);

  useEffect(() => {
    if (!contentRef.current) return;
    if (isOpen) {
      setHeight(contentRef.current.scrollHeight);
      const timer = setTimeout(() => setHeight(undefined), 200);
      return () => clearTimeout(timer);
    } else {
      setHeight(contentRef.current.scrollHeight);
      requestAnimationFrame(() => setHeight(0));
    }
  }, [isOpen]);

  const toggle = () => {
    const next = !isOpen;
    if (!isControlled) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
  };

  return (
    <div
      className={cn(
        'rounded-[16px] border border-[var(--amp-semantic-border-default)] bg-[var(--amp-semantic-bg-surface)]',
        'overflow-hidden transition-shadow duration-150',
        'hover:shadow-[0_4px_12px_rgba(29,37,45,0.10)]',
        className
      )}
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onClick={toggle}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}
        className="cursor-pointer"
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex-1">{header}</div>
          <div
            className={cn(
              'w-7 h-7 rounded-[8px] flex items-center justify-center flex-shrink-0 transition-all duration-200',
              isOpen
                ? 'bg-[var(--amp-semantic-accent-light)] text-[var(--amp-semantic-accent)]'
                : 'bg-[var(--amp-semantic-bg-sunken)] text-[var(--amp-semantic-text-muted)]'
            )}
          >
            <svg
              className={cn('w-3.5 h-3.5 transition-transform duration-200', isOpen && 'rotate-180')}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>
      <div
        ref={contentRef}
        style={{ height: height !== undefined ? `${height}px` : 'auto', overflow: 'hidden', transition: 'height 200ms ease' }}
      >
        <div className="border-t border-[var(--amp-semantic-border-default)]">
          {children}
        </div>
      </div>
    </div>
  );
};
