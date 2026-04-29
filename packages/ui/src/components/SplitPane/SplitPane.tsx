'use client';

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '../../lib/cn';

export type SplitPaneOrientation = 'horizontal' | 'vertical';

export interface SplitPaneProps {
  /** `horizontal` = side-by-side (default), `vertical` = stacked. */
  orientation?: SplitPaneOrientation;
  /** First (top/left) pane. */
  primary: React.ReactNode;
  /** Second (bottom/right) pane. */
  secondary: React.ReactNode;
  /** Initial size of the primary pane in px. Default 50%. */
  defaultSize?: number;
  /** Controlled size in px. */
  size?: number;
  onResize?: (size: number) => void;
  /** Min size of the primary pane in px. Default 80. */
  minSize?: number;
  /** Max size of the primary pane in px. */
  maxSize?: number;
  /**
   * If provided, size is persisted in localStorage under key
   * `amp-splitpane:<name>` and rehydrated on mount.
   */
  name?: string;
  /** Disable resizing. */
  disabled?: boolean;
  /** Class for the wrapper. */
  className?: string;
  /** Aria label for the resize handle (for screen readers). */
  handleAriaLabel?: string;
}

const STORAGE_PREFIX = 'amp-splitpane:';

const readPersisted = (name: string | undefined): number | null => {
  if (!name) return null;
  if (typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(`${STORAGE_PREFIX}${name}`);
    if (!v) return null;
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
};

const writePersisted = (name: string | undefined, size: number) => {
  if (!name) return;
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${name}`, String(size));
  } catch {
    /* no-op */
  }
};

export const SplitPane: React.FC<SplitPaneProps> = ({
  orientation = 'horizontal',
  primary,
  secondary,
  defaultSize,
  size,
  onResize,
  minSize = 80,
  maxSize,
  name,
  disabled = false,
  className,
  handleAriaLabel = 'Resize panes',
}) => {
  const isControlled = typeof size === 'number';
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const [internal, setInternal] = useState<number | null>(() => {
    const persisted = readPersisted(name);
    if (persisted !== null) return persisted;
    if (typeof defaultSize === 'number') return defaultSize;
    return null; // null = default to 50%
  });

  const value = isControlled ? size! : internal;
  const reactId = useId();
  const handleId = `splitpane-${reactId}`;

  const updateSize = useCallback(
    (next: number) => {
      const min = minSize ?? 0;
      const container = containerRef.current;
      const containerSize = container
        ? orientation === 'horizontal'
          ? container.clientWidth
          : container.clientHeight
        : Infinity;
      const max = Math.min(maxSize ?? Infinity, Math.max(min, containerSize - min));
      const clamped = Math.min(max, Math.max(min, next));
      if (!isControlled) setInternal(clamped);
      onResize?.(clamped);
      writePersisted(name, clamped);
    },
    [isControlled, maxSize, minSize, name, onResize, orientation]
  );

  // Mouse / touch drag
  useEffect(() => {
    if (disabled) return;

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!draggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const point =
        'touches' in e ? e.touches[0] : (e as MouseEvent);
      const next =
        orientation === 'horizontal'
          ? point.clientX - rect.left
          : point.clientY - rect.top;
      updateSize(next);
    };
    const onUp = () => {
      draggingRef.current = false;
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [disabled, orientation, updateSize]);

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    draggingRef.current = true;
    document.body.style.userSelect = 'none';
    document.body.style.cursor =
      orientation === 'horizontal' ? 'col-resize' : 'row-resize';
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    const step = e.shiftKey ? 32 : 8;
    const current =
      value ??
      (containerRef.current
        ? (orientation === 'horizontal'
            ? containerRef.current.clientWidth
            : containerRef.current.clientHeight) / 2
        : 200);
    if (orientation === 'horizontal') {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        updateSize(current - step);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        updateSize(current + step);
      }
    } else {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        updateSize(current - step);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        updateSize(current + step);
      }
    }
    if (e.key === 'Home' && minSize !== undefined) {
      e.preventDefault();
      updateSize(minSize);
    }
    if (e.key === 'End' && maxSize !== undefined) {
      e.preventDefault();
      updateSize(maxSize);
    }
  };

  const primaryStyle: React.CSSProperties = useMemo(() => {
    if (value === null) {
      return { flex: '1 1 50%', minWidth: 0, minHeight: 0 };
    }
    const sizeStr = `${value}px`;
    return orientation === 'horizontal'
      ? { width: sizeStr, flexShrink: 0, minWidth: 0 }
      : { height: sizeStr, flexShrink: 0, minHeight: 0 };
  }, [orientation, value]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex w-full h-full',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        className
      )}
    >
      <div
        className={cn(
          'overflow-auto bg-[var(--amp-semantic-bg-surface)]',
          orientation === 'horizontal' ? 'h-full' : 'w-full'
        )}
        style={primaryStyle}
      >
        {primary}
      </div>
      <div
        id={handleId}
        role="separator"
        aria-label={handleAriaLabel}
        aria-orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'}
        aria-valuemin={minSize}
        aria-valuemax={maxSize}
        aria-valuenow={value ?? undefined}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        onKeyDown={onKeyDown}
        className={cn(
          'group flex items-center justify-center shrink-0 transition-colors',
          'bg-[var(--amp-semantic-border-default)] hover:bg-[var(--amp-semantic-border-focus)]',
          'focus-visible:outline-none focus-visible:bg-[var(--amp-semantic-border-focus)]',
          orientation === 'horizontal'
            ? 'w-1 cursor-col-resize'
            : 'h-1 cursor-row-resize',
          disabled && 'cursor-default opacity-50'
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'block bg-[var(--amp-semantic-text-muted)] opacity-0 group-hover:opacity-60 transition-opacity rounded-full',
            orientation === 'horizontal' ? 'h-8 w-0.5' : 'w-8 h-0.5'
          )}
        />
      </div>
      <div
        className={cn(
          'flex-1 min-w-0 min-h-0 overflow-auto bg-[var(--amp-semantic-bg-surface)]'
        )}
      >
        {secondary}
      </div>
    </div>
  );
};

SplitPane.displayName = 'SplitPane';
