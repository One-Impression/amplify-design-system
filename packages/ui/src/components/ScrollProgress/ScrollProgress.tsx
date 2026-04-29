'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';

export type ScrollProgressVariant = 'linear' | 'radial';
export type ScrollProgressPosition = 'top' | 'bottom';

export interface ScrollProgressProps {
  /** Linear (top-of-page bar) or radial (small dial). */
  variant?: ScrollProgressVariant;
  /** Position the linear bar at top or bottom. Ignored for radial. Default 'top'. */
  position?: ScrollProgressPosition;
  /** Bar/ring color. Defaults to accent token. */
  color?: string;
  /** Track (background) color for radial. Defaults to muted border. */
  trackColor?: string;
  /** Bar height (px) for linear. Default 3. */
  thickness?: number;
  /** Diameter (px) for radial. Default 40. */
  size?: number;
  /** Element to track instead of window scroll. */
  target?: React.RefObject<HTMLElement>;
  /** ZIndex for fixed-position linear bar. */
  zIndex?: number;
  className?: string;
}

function getProgress(target?: HTMLElement | null): number {
  if (target) {
    const max = target.scrollHeight - target.clientHeight;
    if (max <= 0) return 0;
    return Math.max(0, Math.min(1, target.scrollTop / max));
  }
  if (typeof window === 'undefined') return 0;
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  if (max <= 0) return 0;
  return Math.max(0, Math.min(1, (window.scrollY || doc.scrollTop) / max));
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  variant = 'linear',
  position = 'top',
  color,
  trackColor,
  thickness = 3,
  size = 40,
  target,
  zIndex = 50,
  className,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = target?.current ?? null;

    const onScroll = () => {
      if (frameRef.current != null) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        setProgress(getProgress(el));
      });
    };

    setProgress(getProgress(el));
    const subject: Window | HTMLElement = el ?? window;
    subject.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      subject.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    };
  }, [target]);

  const barColor = color || 'var(--amp-semantic-accent)';
  const bgColor = trackColor || 'var(--amp-semantic-border-default)';

  if (variant === 'radial') {
    const stroke = Math.max(2, Math.round(size / 12));
    const r = size / 2 - stroke;
    const c = 2 * Math.PI * r;
    const dash = c * (1 - progress);
    return (
      <div
        role="progressbar"
        aria-label="Scroll progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        className={cn('inline-flex items-center justify-center', className)}
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={bgColor}
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={barColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={dash}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 80ms linear' }}
          />
        </svg>
      </div>
    );
  }

  // Linear
  return (
    <div
      role="progressbar"
      aria-label="Scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      className={cn(
        'fixed left-0 right-0 pointer-events-none',
        position === 'top' ? 'top-0' : 'bottom-0',
        className
      )}
      style={{ height: thickness, zIndex }}
    >
      <div
        className="h-full origin-left"
        style={{
          width: '100%',
          backgroundColor: barColor,
          transform: `scaleX(${progress})`,
          transition: 'transform 80ms linear',
        }}
      />
    </div>
  );
};
