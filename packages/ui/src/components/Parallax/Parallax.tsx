'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '../../lib/cn';
import { useReducedMotion } from '../../lib/useReducedMotion';

export type ParallaxDirection = 'vertical' | 'horizontal';

export interface ParallaxProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Movement intensity, 0 (none) to 1 (full scroll). Default 0.3. */
  speed?: number;
  /** Axis to translate along. */
  direction?: ParallaxDirection;
  /** Polymorphic element. Default 'div'. */
  as?: keyof React.JSX.IntrinsicElements;
  children: React.ReactNode;
}

/**
 * Translates its children along the scroll axis, creating a parallax effect.
 * Uses requestAnimationFrame-throttled scroll listener; respects prefers-reduced-motion.
 */
export const Parallax: React.FC<ParallaxProps> = ({
  speed = 0.3,
  direction = 'vertical',
  as = 'div',
  className,
  style,
  children,
  ...rest
}) => {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  // Clamp speed to a sane range.
  const clamped = Math.max(0, Math.min(1, speed));

  useEffect(() => {
    if (reduced) return;
    const node = ref.current;
    if (!node || typeof window === 'undefined') return;

    const update = () => {
      frameRef.current = null;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      // Distance from viewport center, in px.
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const offset = (elementCenter - viewportCenter) * clamped * -1;
      const translate =
        direction === 'vertical'
          ? `translate3d(0, ${offset.toFixed(2)}px, 0)`
          : `translate3d(${offset.toFixed(2)}px, 0, 0)`;
      node.style.transform = translate;
    };

    const onScroll = () => {
      if (frameRef.current != null) return;
      frameRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    };
  }, [clamped, direction, reduced]);

  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={ref}
      className={cn(className)}
      style={{ willChange: reduced ? undefined : 'transform', ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
};
