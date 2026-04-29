'use client';

import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  size?: DrawerSize;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  /** Footer slot (typically action buttons aligned right). */
  footer?: React.ReactNode;
  /** Dismiss when overlay is clicked. Default true. */
  dismissOnOverlay?: boolean;
  /** Dismiss when Escape is pressed. Default true. */
  dismissOnEscape?: boolean;
  /** Render without the dim overlay (e.g. side info panel). */
  hideOverlay?: boolean;
  className?: string;
}

const SIDE_PANEL: Record<DrawerSide, string> = {
  left: 'left-0 top-0 bottom-0 border-r',
  right: 'right-0 top-0 bottom-0 border-l',
  top: 'top-0 left-0 right-0 border-b',
  bottom: 'bottom-0 left-0 right-0 border-t',
};

const SIZE_CLASSES: Record<DrawerSide, Record<DrawerSize, string>> = {
  left: { sm: 'w-72', md: 'w-96', lg: 'w-[32rem]' },
  right: { sm: 'w-72', md: 'w-96', lg: 'w-[32rem]' },
  top: { sm: 'h-32', md: 'h-64', lg: 'h-96' },
  bottom: { sm: 'h-32', md: 'h-64', lg: 'h-96' },
};

function getFocusable(el: HTMLElement): HTMLElement[] {
  return Array.from(
    el.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );
}

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  side = 'right',
  size = 'md',
  title,
  description,
  children,
  footer,
  dismissOnOverlay = true,
  dismissOnEscape = true,
  hideOverlay = false,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const uid = useId();
  const titleId = `${uid}-drawer-title`;
  const descId = `${uid}-drawer-desc`;

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (dismissOnEscape && e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && ref.current) {
        const focusable = getFocusable(ref.current);
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first || document.activeElement === ref.current) {
            e.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose, dismissOnEscape]);

  useEffect(() => {
    if (open && ref.current) ref.current.focus();
  }, [open]);

  if (!open || typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      {!hideOverlay && (
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          onClick={dismissOnOverlay ? onClose : undefined}
          aria-hidden="true"
        />
      )}
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn(
          'absolute flex flex-col',
          'bg-[var(--amp-semantic-bg-surface)] border-[var(--amp-semantic-border-default)]',
          'shadow-2xl focus:outline-none',
          SIDE_PANEL[side],
          SIZE_CLASSES[side][size],
          (side === 'left' || side === 'right') && 'max-w-full',
          (side === 'top' || side === 'bottom') && 'max-h-full',
          className
        )}
      >
        {(title || description) && (
          <div className="px-5 pt-5 pb-3 border-b border-[var(--amp-semantic-border-default)]">
            {title && (
              <h2
                id={titleId}
                className="text-[16px] font-semibold text-[var(--amp-semantic-text-primary)]"
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                id={descId}
                className="mt-1 text-[13px] text-[var(--amp-semantic-text-secondary)]"
              >
                {description}
              </p>
            )}
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="px-5 py-3 border-t border-[var(--amp-semantic-border-default)] flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
