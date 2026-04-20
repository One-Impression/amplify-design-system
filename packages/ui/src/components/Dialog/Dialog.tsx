import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  actions,
  className,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'dialog-title' : undefined}
        aria-describedby={description ? 'dialog-description' : undefined}
        tabIndex={-1}
        className={cn(
          'relative z-10 w-full max-w-md rounded-[16px] p-6',
          'bg-[var(--amp-semantic-bg-surface)] border border-[var(--amp-semantic-border-default)]',
          'shadow-xl',
          'focus:outline-none',
          className
        )}
      >
        {title && (
          <h2
            id="dialog-title"
            className="text-[18px] font-semibold text-[var(--amp-semantic-text-primary)] mb-1"
          >
            {title}
          </h2>
        )}
        {description && (
          <p
            id="dialog-description"
            className="text-[14px] text-[var(--amp-semantic-text-secondary)] mb-4"
          >
            {description}
          </p>
        )}
        {children && <div className="mb-4">{children}</div>}
        {actions && (
          <div className="flex items-center justify-end gap-2 pt-2">{actions}</div>
        )}
      </div>
    </div>,
    document.body
  );
};
