'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import { useReducedMotion } from '../../lib/useReducedMotion';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'fade';
export type RevealTrigger = 'mount' | 'scroll';

export interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  /** Polymorphic element. Default 'div'. */
  as?: keyof React.JSX.IntrinsicElements;
  /** Animate from this direction into final position. */
  direction?: RevealDirection;
  /** Delay in ms before animation starts. */
  delay?: number;
  /** Animation duration in ms. */
  duration?: number;
  /** Pixels of offset translation for directional reveals. Default 16. */
  distance?: number;
  /** Trigger reveal on mount or when element scrolls into view. Default 'scroll'. */
  trigger?: RevealTrigger;
  /** IntersectionObserver threshold (scroll trigger only). Default 0.15. */
  threshold?: number;
  /** Run reveal once and stop observing (scroll trigger only). Default true. */
  once?: boolean;
  children: React.ReactNode;
}

const directionTransform: Record<RevealDirection, (d: number) => string> = {
  up: (d) => `translateY(${d}px)`,
  down: (d) => `translateY(-${d}px)`,
  left: (d) => `translateX(${d}px)`,
  right: (d) => `translateX(-${d}px)`,
  fade: () => 'none',
};

export const Reveal: React.FC<RevealProps> = ({
  as = 'div',
  direction = 'up',
  delay = 0,
  duration = 500,
  distance = 16,
  trigger = 'scroll',
  threshold = 0.15,
  once = true,
  className,
  style,
  children,
  ...rest
}) => {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(trigger === 'mount' ? false : false);

  useEffect(() => {
    if (reduced) {
      setVisible(true);
      return;
    }
    if (trigger === 'mount') {
      // Defer one frame so initial style is applied before transition.
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) obs.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [trigger, threshold, once, reduced]);

  const Tag = as as React.ElementType;

  // TODO(phase-a): swap to amplify-motion-* tokens for duration + easing
  const transitionStyle: React.CSSProperties = reduced
    ? {}
    : {
        transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : directionTransform[direction](distance),
        willChange: 'opacity, transform',
      };

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn(className)}
      style={{ ...transitionStyle, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
};
