'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';

export type HoverCardSide = 'top' | 'bottom' | 'left' | 'right';

export interface HoverCardProps {
  /** Trigger element — the thing the user hovers/focuses. */
  children: React.ReactNode;
  /** Rich content rendered inside the card. */
  content: React.ReactNode;
  /** Delay before opening, ms. Default 250. */
  openDelay?: number;
  /** Delay before closing once hover leaves both trigger + card, ms. Default 200. */
  closeDelay?: number;
  side?: HoverCardSide;
  /** Width of the popover. Default 320px. */
  width?: number | string;
  className?: string;
  /** Class applied to the card container. */
  contentClassName?: string;
}

const sideClasses: Record<HoverCardSide, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export const HoverCard: React.FC<HoverCardProps> = ({
  children,
  content,
  openDelay = 250,
  closeDelay = 200,
  side = 'bottom',
  width = 320,
  className,
  contentClassName,
}) => {
  const [open, setOpen] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (openTimer.current) clearTimeout(openTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const scheduleOpen = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (openTimer.current) clearTimeout(openTimer.current);
    openTimer.current = setTimeout(() => setOpen(true), openDelay);
  };

  const scheduleClose = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), closeDelay);
  };

  return (
    <span
      className={cn('relative inline-flex', className)}
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
      onFocus={scheduleOpen}
      onBlur={scheduleClose}
    >
      {children}
      {open && (
        <div
          role="dialog"
          aria-label="Hover card"
          onMouseEnter={scheduleOpen}
          onMouseLeave={scheduleClose}
          style={{ width: typeof width === 'number' ? `${width}px` : width }}
          className={cn(
            'absolute z-50 p-4 rounded-[12px]',
            'bg-[var(--amp-semantic-bg-surface)] border border-[var(--amp-semantic-border-default)]',
            'shadow-xl text-left',
            sideClasses[side],
            contentClassName
          )}
        >
          {content}
        </div>
      )}
    </span>
  );
};
