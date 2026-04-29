'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';

export type ContextMenuItem =
  | {
      type?: 'item';
      id: string;
      label: string;
      icon?: React.ReactNode;
      shortcut?: string;
      disabled?: boolean;
      destructive?: boolean;
      onSelect: () => void;
      submenu?: ContextMenuItem[];
    }
  | { type: 'separator'; id?: string }
  | { type: 'label'; id?: string; label: string };

export interface ContextMenuProps {
  /** Children that the user can right-click / long-press. */
  children: React.ReactNode;
  items: ContextMenuItem[];
  /** Long-press delay in ms for touch devices. Default 500. */
  longPressMs?: number;
  /** Disable opening — children render as-is. */
  disabled?: boolean;
  className?: string;
}

interface MenuState {
  x: number;
  y: number;
  items: ContextMenuItem[];
  parent?: MenuState | null;
}

const isBrowser = typeof window !== 'undefined';

const ChevronRight = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

interface MenuLayerProps {
  state: MenuState;
  onClose: () => void;
  onOpenSubmenu: (next: MenuState) => void;
  level: number;
}

const MenuLayer: React.FC<MenuLayerProps> = ({ state, onClose, onOpenSubmenu, level }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [adjusted, setAdjusted] = useState({ x: state.x, y: state.y });

  useEffect(() => {
    if (!ref.current || !isBrowser) return;
    const rect = ref.current.getBoundingClientRect();
    let nx = state.x;
    let ny = state.y;
    if (nx + rect.width > window.innerWidth - 8) nx = Math.max(8, window.innerWidth - rect.width - 8);
    if (ny + rect.height > window.innerHeight - 8) ny = Math.max(8, window.innerHeight - rect.height - 8);
    setAdjusted({ x: nx, y: ny });
  }, [state.x, state.y]);

  return (
    <div
      ref={ref}
      role="menu"
      style={{ left: adjusted.x, top: adjusted.y }}
      className={cn(
        'fixed z-[60] min-w-[200px] py-1 rounded-[12px]',
        'bg-[var(--amp-semantic-bg-surface)] border border-[var(--amp-semantic-border-default)] shadow-2xl'
      )}
    >
      {state.items.map((item, idx) => {
        if (item.type === 'separator') {
          return (
            <div
              key={item.id ?? `sep-${idx}`}
              className="my-1 h-px bg-[var(--amp-semantic-border-default)]"
              role="separator"
            />
          );
        }
        if (item.type === 'label') {
          return (
            <div
              key={item.id ?? `label-${idx}`}
              className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--amp-semantic-text-muted)]"
            >
              {item.label}
            </div>
          );
        }
        const hasSubmenu = !!item.submenu && item.submenu.length > 0;
        return (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            disabled={item.disabled}
            onMouseEnter={(e) => {
              if (!hasSubmenu) return;
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
              onOpenSubmenu({
                x: rect.right - 4,
                y: rect.top,
                items: item.submenu!,
                parent: state,
              });
            }}
            onClick={() => {
              if (item.disabled) return;
              if (hasSubmenu) return;
              item.onSelect();
              onClose();
            }}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 text-left text-[13px]',
              item.destructive
                ? 'text-[var(--amp-semantic-status-error)] hover:bg-[var(--amp-semantic-status-error)]/10'
                : 'text-[var(--amp-semantic-text-primary)] hover:bg-[var(--amp-semantic-bg-raised)]',
              item.disabled && 'opacity-40 cursor-not-allowed hover:bg-transparent'
            )}
          >
            {item.icon && <span className="w-4 h-4 flex items-center text-[var(--amp-semantic-text-muted)]">{item.icon}</span>}
            <span className="flex-1 truncate">{item.label}</span>
            {item.shortcut && (
              <span className="text-[11px] text-[var(--amp-semantic-text-muted)]">{item.shortcut}</span>
            )}
            {hasSubmenu && (
              <span className="text-[var(--amp-semantic-text-muted)]" aria-hidden="true">
                {ChevronRight}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export const ContextMenu: React.FC<ContextMenuProps> = ({
  children,
  items,
  longPressMs = 500,
  disabled,
  className,
}) => {
  const [stack, setStack] = useState<MenuState[]>([]);
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = useCallback(
    (x: number, y: number) => {
      setStack([{ x, y, items }]);
    },
    [items]
  );

  const close = useCallback(() => setStack([]), []);

  useEffect(() => {
    if (stack.length === 0) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('[role="menu"]')) return;
      close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [stack.length, close]);

  if (disabled) return <>{children}</>;

  return (
    <>
      <div
        className={cn('contents', className)}
        onContextMenu={(e) => {
          e.preventDefault();
          open(e.clientX, e.clientY);
        }}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          if (!touch) return;
          const x = touch.clientX;
          const y = touch.clientY;
          longPressRef.current = setTimeout(() => open(x, y), longPressMs);
        }}
        onTouchEnd={() => {
          if (longPressRef.current) clearTimeout(longPressRef.current);
        }}
        onTouchMove={() => {
          if (longPressRef.current) clearTimeout(longPressRef.current);
        }}
      >
        {children}
      </div>
      {isBrowser &&
        stack.length > 0 &&
        createPortal(
          <>
            {stack.map((state, idx) => (
              <MenuLayer
                key={idx}
                state={state}
                level={idx}
                onClose={close}
                onOpenSubmenu={(next) => setStack((prev) => [...prev.slice(0, idx + 1), next])}
              />
            ))}
          </>,
          document.body
        )}
    </>
  );
};
