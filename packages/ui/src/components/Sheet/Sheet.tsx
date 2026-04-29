'use client';

import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';

export type SheetMode = 'side' | 'modal' | 'fullscreen';
export type SheetSide = 'left' | 'right';

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  /**
   * `side`       — full-height panel anchored to a side (covers most of the viewport)
   * `modal`      — centered card-style sheet, dramatic, used for focused tasks
   * `fullscreen` — entire viewport (mobile / form fill)
   *
   * Distinguishes Sheet from Drawer: Sheet is the heavyweight twin,
   * intended for sustained, focused tasks (compose, review, configure)
   * rather than quick informational glances (Drawer's job).
   */
  mode?: SheetMode;
  side?: SheetSide;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  /** Width for `side` and `modal` modes. Defaults to 640px / 560px respectively. */
  width?: number | string;
  className?: string;
}

function getFocusable(el: HTMLElement): HTMLElement[] {
  return Array.from(
    el.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );
}

export const Sheet: React.FC<SheetProps> = ({
  open,
  onClose,
  mode = 'side',
  side = 'right',
  title,
  description,
  children,
  footer,
  width,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const uid = useId();
  const titleId = `${uid}-sheet-title`;
  const descId = `${uid}-sheet-desc`;

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
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
  }, [open, onClose]);

  useEffect(() => {
    if (open && ref.current) ref.current.focus();
  }, [open]);

  if (!open || typeof window === 'undefined') return null;

  const sizeStyle: React.CSSProperties = {};
  if (width != null && (mode === 'side' || mode === 'modal')) {
    sizeStyle.width = typeof width === 'number' ? `${width}px` : width;
  }

  let panel: React.ReactNode;

  if (mode === 'fullscreen') {
    panel = (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn(
          'absolute inset-0 flex flex-col bg-[var(--amp-semantic-bg-base)] focus:outline-none',
          className
        )}
      >
        {(title || description) && (
          <div className="px-6 pt-6 pb-4 border-b border-[var(--amp-semantic-border-default)]">
            {title && (
              <h2 id={titleId} className="text-[20px] font-semibold text-[var(--amp-semantic-text-primary)]">
                {title}
              </h2>
            )}
            {description && (
              <p id={descId} className="mt-1 text-[14px] text-[var(--amp-semantic-text-secondary)]">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-[var(--amp-semantic-border-default)] flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    );
  } else if (mode === 'modal') {
    panel = (
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descId : undefined}
          tabIndex={-1}
          style={{ width: typeof width === 'number' ? `${width}px` : (width ?? '560px') }}
          className={cn(
            'flex flex-col max-h-[90vh] rounded-[20px]',
            'bg-[var(--amp-semantic-bg-surface)] border border-[var(--amp-semantic-border-default)]',
            'shadow-2xl focus:outline-none',
            className
          )}
        >
          {(title || description) && (
            <div className="px-6 pt-6 pb-4 border-b border-[var(--amp-semantic-border-default)]">
              {title && (
                <h2 id={titleId} className="text-[18px] font-semibold text-[var(--amp-semantic-text-primary)]">
                  {title}
                </h2>
              )}
              {description && (
                <p id={descId} className="mt-1 text-[13px] text-[var(--amp-semantic-text-secondary)]">
                  {description}
                </p>
              )}
            </div>
          )}
          <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
          {footer && (
            <div className="px-6 py-4 border-t border-[var(--amp-semantic-border-default)] flex items-center justify-end gap-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  } else {
    // side mode — full-height side panel, larger than Drawer
    panel = (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        style={{ width: typeof width === 'number' ? `${width}px` : (width ?? '640px') }}
        className={cn(
          'absolute top-0 bottom-0 flex flex-col max-w-full',
          'bg-[var(--amp-semantic-bg-surface)]',
          'shadow-2xl focus:outline-none',
          side === 'right' ? 'right-0 border-l border-[var(--amp-semantic-border-default)]' : 'left-0 border-r border-[var(--amp-semantic-border-default)]',
          className
        )}
      >
        {(title || description) && (
          <div className="px-6 pt-6 pb-4 border-b border-[var(--amp-semantic-border-default)]">
            {title && (
              <h2 id={titleId} className="text-[20px] font-semibold text-[var(--amp-semantic-text-primary)]">
                {title}
              </h2>
            )}
            {description && (
              <p id={descId} className="mt-1 text-[14px] text-[var(--amp-semantic-text-secondary)]">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-[var(--amp-semantic-border-default)] flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {panel}
    </div>,
    document.body
  );
};
