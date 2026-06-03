'use client';

import React from 'react';
import { cn } from '../../lib/cn';

/**
 * WishChip — toggleable chip for selecting wishlist/habit options in Oportunities.
 *
 * Three visual states:
 *   - Default: white bg, border, neutral text
 *   - Selected: accent bg, white text, checkmark prefix
 *   - Disabled: faded, non-interactive
 *
 * Tokens consumed:
 *   --amp-oportunities-border  (default border)
 *   --amp-oportunities-accent  (selected bg)
 */

export interface WishChipProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Display label. */
  label: string;
  /** Whether the chip is currently selected. */
  selected?: boolean;
  /** Disable interaction (e.g. when max limit is reached). */
  disabled?: boolean;
  /** Called when the chip is toggled. */
  onToggle?: () => void;
  className?: string;
}

export const WishChip = React.forwardRef<HTMLButtonElement, WishChipProps>(
  ({ label, selected = false, disabled = false, onToggle, className, style, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={selected}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={disabled ? undefined : onToggle}
        className={cn('inline-flex items-center', className)}
        style={{
          padding: '10px 14px',
          borderRadius: 12,
          border: selected ? 'none' : '1px solid var(--amp-oportunities-border, #EFE4D4)',
          background: selected ? 'var(--amp-oportunities-accent, #E68F47)' : '#FFFFFF',
          color: selected ? '#FFFFFF' : 'inherit',
          fontSize: 13,
          fontWeight: 500,
          fontFamily: 'Inter, sans-serif',
          lineHeight: 1.2,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.4 : 1,
          gap: 4,
          transition: 'background 0.15s ease, color 0.15s ease, opacity 0.15s ease',
          ...style,
        }}
        {...rest}
      >
        {selected && (
          <span aria-hidden="true" style={{ fontSize: 12 }}>
            {'✓'}
          </span>
        )}
        {label}
      </button>
    );
  },
);

WishChip.displayName = 'WishChip';
