import React from 'react';
import { cn } from '../../lib/cn';

export type KbdSize = 'sm' | 'md';

/**
 * Special tokens that get platform-aware substitution when passed via `keys`.
 * - `mod` → ⌘ on Mac, Ctrl elsewhere
 * - `alt` → ⌥ on Mac, Alt elsewhere
 * - `shift` → ⇧ on Mac, Shift elsewhere
 * - `enter` → ⏎
 * - `esc` → Esc
 */
export type KbdKey =
  | 'mod'
  | 'alt'
  | 'shift'
  | 'enter'
  | 'esc'
  | 'tab'
  | 'space'
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | (string & {});

export interface KbdProps {
  /** Static label — used when `keys` is not provided. Pass a single key like "K". */
  children?: React.ReactNode;
  /**
   * Optional list of keys. When provided, the component renders one
   * `<kbd>` element per key with platform-aware substitution.
   */
  keys?: KbdKey[];
  /** Visual size. */
  size?: KbdSize;
  /** Override platform detection — useful for tests + cross-platform docs. */
  isMac?: boolean;
  /** Accessibility label override. Defaults to the rendered key sequence. */
  'aria-label'?: string;
  className?: string;
}

const sizeClasses: Record<KbdSize, string> = {
  sm: 'min-w-[18px] h-[18px] px-1 text-[10px]',
  md: 'min-w-[22px] h-[22px] px-1.5 text-[11px]',
};

function detectIsMac(): boolean {
  if (typeof navigator === 'undefined') return false;
  // navigator.platform is deprecated but still the most reliable signal in jsdom + browsers.
  return /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent || '');
}

const macMap: Record<string, string> = {
  mod: '⌘',
  alt: '⌥',
  shift: '⇧',
  enter: '⏎',
  esc: 'Esc',
  tab: '⇥',
  space: 'Space',
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
};

const winMap: Record<string, string> = {
  mod: 'Ctrl',
  alt: 'Alt',
  shift: 'Shift',
  enter: 'Enter',
  esc: 'Esc',
  tab: 'Tab',
  space: 'Space',
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
};

function resolveKey(key: KbdKey, isMac: boolean): string {
  const map = isMac ? macMap : winMap;
  const lower = key.toLowerCase();
  return map[lower] ?? key.toString();
}

const baseClasses = cn(
  'inline-flex items-center justify-center',
  'font-mono font-medium leading-none',
  'rounded-[4px] border',
  'bg-[var(--amp-semantic-bg-raised)] text-[var(--amp-semantic-text-secondary)]',
  'border-[var(--amp-semantic-border-default)]',
  'shadow-[inset_0_-1px_0_var(--amp-semantic-border-default)]'
);

/**
 * Inline keyboard-shortcut hint.
 *
 * Two modes:
 * 1. Static — pass children: `<Kbd>K</Kbd>`
 * 2. Platform-aware sequence — pass keys: `<Kbd keys={["mod","K"]} />` renders
 *    `⌘ K` on Mac and `Ctrl K` on Windows/Linux.
 */
export const Kbd: React.FC<KbdProps> = ({
  children,
  keys,
  size = 'md',
  isMac,
  className,
  'aria-label': ariaLabel,
}) => {
  if (keys && keys.length > 0) {
    const mac = isMac ?? detectIsMac();
    const resolved = keys.map((k) => resolveKey(k, mac));
    const label = ariaLabel ?? resolved.join(' ');
    return (
      <span
        role="img"
        aria-label={label}
        className={cn('inline-flex items-center gap-1', className)}
      >
        {resolved.map((key, i) => (
          <kbd key={i} className={cn(baseClasses, sizeClasses[size])} aria-hidden="true">
            {key}
          </kbd>
        ))}
      </span>
    );
  }

  const label =
    ariaLabel ?? (typeof children === 'string' ? children : undefined);
  return (
    <kbd
      role="img"
      aria-label={label}
      className={cn(baseClasses, sizeClasses[size], className)}
    >
      {children}
    </kbd>
  );
};
