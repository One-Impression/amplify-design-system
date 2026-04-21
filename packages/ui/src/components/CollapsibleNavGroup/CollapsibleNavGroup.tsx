import React, { useState, useId } from 'react';
import { cn } from '../../lib/cn';

export interface CollapsibleNavGroupProps {
  /** Group label text */
  label: string;
  /** Optional icon (emoji or string) displayed before the label */
  icon?: string;
  /** Optional count badge shown to the right */
  count?: number;
  /** Whether the group starts expanded */
  defaultExpanded?: boolean;
  /** Controlled expanded state (overrides internal state) */
  expanded?: boolean;
  /** Callback when expanded state changes */
  onToggle?: (expanded: boolean) => void;
  /** Child navigation items rendered when expanded */
  children: React.ReactNode;
  /** Additional CSS class */
  className?: string;
}

export const CollapsibleNavGroup: React.FC<CollapsibleNavGroupProps> = ({
  label,
  icon,
  count,
  defaultExpanded = false,
  expanded: controlledExpanded,
  onToggle,
  children,
  className,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = controlledExpanded ?? internalExpanded;
  const headingId = useId();
  const groupId = useId();

  const toggle = () => {
    const next = !isExpanded;
    if (controlledExpanded === undefined) {
      setInternalExpanded(next);
    }
    onToggle?.(next);
  };

  return (
    <div className={cn('w-full', className)}>
      <button
        id={headingId}
        onClick={toggle}
        aria-expanded={isExpanded}
        aria-controls={groupId}
        className={cn(
          'flex items-center w-full pl-8 pr-4 py-1.5',
          'text-[10px] font-semibold uppercase tracking-wider',
          'text-[var(--amp-semantic-text-tertiary,var(--text-faint,#666))]',
          'hover:text-[var(--amp-semantic-text-secondary,var(--text-muted,#999))]',
          'transition-colors duration-150 cursor-pointer select-none',
          'border-0 bg-transparent',
        )}
      >
        {/* Chevron */}
        <span
          className="text-[8px] mr-1 inline-block w-2 text-center transition-transform duration-200"
          style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
          aria-hidden="true"
        >
          ▾
        </span>

        {/* Icon */}
        {icon && (
          <span className="opacity-70 mr-1" aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Label */}
        {label}

        {/* Count */}
        {count !== undefined && (
          <span
            className="ml-auto text-[9px] font-medium transition-colors duration-150"
            style={{
              color: isExpanded
                ? 'var(--amp-semantic-accent, var(--accent-gold, #c9a96e))'
                : undefined,
            }}
            aria-label={`${count} items`}
          >
            {count}
          </span>
        )}
      </button>

      {/* Children */}
      {isExpanded && (
        <div
          id={groupId}
          role="group"
          aria-labelledby={headingId}
        >
          {children}
        </div>
      )}
    </div>
  );
};
