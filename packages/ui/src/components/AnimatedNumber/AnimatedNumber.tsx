'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import { useReducedMotion } from '../../lib/useReducedMotion';

export type AnimatedNumberFormatter = (value: number) => string;

export interface AnimatedNumberProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Target value to animate to. */
  value: number;
  /** Starting value. Defaults to 0 on first mount, then previous value. */
  from?: number;
  /** Animation duration in ms. Default 1000. */
  duration?: number;
  /** Easing function. Default cubic ease-out. */
  easing?: (t: number) => number;
  /** Formatter, e.g. `n => n.toFixed(2)` or `n => '$' + n.toLocaleString()`. Default rounds to integer with locale. */
  format?: AnimatedNumberFormatter;
  /** Trigger animation only when scrolled into view. Default false (animate immediately). */
  animateOnView?: boolean;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const defaultFormat: AnimatedNumberFormatter = (n) => Math.round(n).toLocaleString();

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  from,
  duration = 1000,
  easing = easeOutCubic,
  format = defaultFormat,
  animateOnView = false,
  className,
  ...rest
}) => {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const previousRef = useRef<number>(from ?? 0);
  const rafRef = useRef<number | null>(null);
  const [display, setDisplay] = useState<number>(reduced ? value : (from ?? 0));
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(!animateOnView);

  // Observe viewport entry when animateOnView is set.
  useEffect(() => {
    if (!animateOnView) return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setShouldAnimate(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShouldAnimate(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [animateOnView]);

  useEffect(() => {
    if (!shouldAnimate) return;
    if (reduced) {
      setDisplay(value);
      previousRef.current = value;
      return;
    }
    const start = previousRef.current;
    const delta = value - start;
    if (delta === 0) {
      setDisplay(value);
      return;
    }
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = easing(t);
      const current = start + delta * eased;
      setDisplay(current);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        previousRef.current = value;
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration, easing, reduced, shouldAnimate]);

  return (
    <span
      ref={ref}
      // tabular-nums prevents width jitter as digits change
      className={cn('tabular-nums', className)}
      aria-live="polite"
      {...rest}
    >
      {format(display)}
    </span>
  );
};
