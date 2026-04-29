'use client';

import React from 'react';
import { cn } from '../../lib/cn';

export type TypingIndicatorSize = 'sm' | 'md' | 'lg';

export interface TypingIndicatorProps {
  /** Optional label (e.g. "Penny is typing"). */
  label?: string;
  /** Custom dot color (CSS color or var). Defaults to muted text token. */
  color?: string;
  /** Size preset. */
  size?: TypingIndicatorSize;
  /** Aria label for screen readers when no visible label. */
  ariaLabel?: string;
  className?: string;
}

const dotSize: Record<TypingIndicatorSize, string> = {
  sm: 'w-1 h-1',
  md: 'w-1.5 h-1.5',
  lg: 'w-2 h-2',
};

// Inline keyframes — avoids depending on tailwind config additions.
const styleId = 'amp-typing-indicator-keyframes';
const keyframesCSS = `
@keyframes amp-typing-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-3px); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .amp-typing-dot { animation: none !important; opacity: 0.7 !important; }
}
`;

function ensureKeyframes() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(styleId)) return;
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = keyframesCSS;
  document.head.appendChild(style);
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  label,
  color,
  size = 'md',
  ariaLabel = 'Typing',
  className,
}) => {
  React.useEffect(() => {
    ensureKeyframes();
  }, []);

  const dotColor = color || 'var(--amp-semantic-text-muted)';

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label || ariaLabel}
      className={cn('inline-flex items-center gap-2', className)}
    >
      <span className="inline-flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn('amp-typing-dot inline-block rounded-full', dotSize[size])}
            style={{
              backgroundColor: dotColor,
              animation: 'amp-typing-bounce 1.2s infinite ease-in-out',
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </span>
      {label && (
        <span className="text-[12px] text-[var(--amp-semantic-text-muted)]">{label}</span>
      )}
    </div>
  );
};
