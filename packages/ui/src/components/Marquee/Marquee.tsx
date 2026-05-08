'use client';

import React from 'react';
import { cn } from '../../lib/cn';

export type MarqueeDirection = 'left' | 'right';
export type MarqueeSpeed = 'slow' | 'normal' | 'fast';

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Items to scroll. Children are duplicated internally so the loop is seamless. */
  children: React.ReactNode;
  /** Scroll direction. */
  direction?: MarqueeDirection;
  /** Animation speed. */
  speed?: MarqueeSpeed;
  /** Pause animation when the cursor enters the strip. Default `true`. */
  pauseOnHover?: boolean;
  /** Gap between items, in px. */
  gap?: number;
  /**
   * Optional fade mask on the left/right edges so items dissolve into the page.
   * Default `true`.
   */
  fadeEdges?: boolean;
}

const speedDuration: Record<MarqueeSpeed, string> = {
  slow: '60s',
  normal: '40s',
  fast: '20s',
};

// Inline keyframes — keeps the component self-contained, no external CSS file
// required. Only injected once per page (id-guarded). Animates -50% because the
// track contains two copies of the strip side-by-side, so a -50% shift lands
// the second copy exactly where the first started — seamless loop.
const STYLE_ID = 'amp-marquee-keyframes';
const styleSheet = `
@keyframes amp-marquee-scroll-left {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@keyframes amp-marquee-scroll-right {
  from { transform: translateX(-50%); }
  to   { transform: translateX(0); }
}
@media (prefers-reduced-motion: reduce) {
  .amp-marquee-track { animation: none !important; transform: none !important; }
}
`;

function useInjectedKeyframes() {
  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = styleSheet;
    document.head.appendChild(el);
  }, []);
}

export const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  (
    {
      children,
      direction = 'left',
      speed = 'normal',
      pauseOnHover = true,
      gap = 32,
      fadeEdges = true,
      className,
      style,
      ...props
    },
    ref
  ) => {
    useInjectedKeyframes();

    const animationName =
      direction === 'left' ? 'amp-marquee-scroll-left' : 'amp-marquee-scroll-right';

    const trackStyle: React.CSSProperties = {
      animationName,
      animationDuration: speedDuration[speed],
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
      gap: `${gap}px`,
      paddingRight: `${gap}px`,
    };

    const maskStyle: React.CSSProperties = fadeEdges
      ? {
          maskImage:
            'linear-gradient(to right, transparent 0, #000 8%, #000 92%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0, #000 8%, #000 92%, transparent 100%)',
        }
      : {};

    return (
      <div
        ref={ref}
        role="marquee"
        aria-label={
          typeof props['aria-label'] === 'string' ? props['aria-label'] : 'Scrolling content'
        }
        className={cn(
          'relative w-full overflow-hidden',
          pauseOnHover && '[&:hover_.amp-marquee-track]:[animation-play-state:paused]',
          className
        )}
        style={{ ...maskStyle, ...style }}
        {...props}
      >
        <div
          className={cn('amp-marquee-track flex w-max items-center')}
          style={trackStyle}
        >
          {/* First copy. */}
          <div className="flex shrink-0 items-center" style={{ gap: `${gap}px`, paddingRight: `${gap}px` }}>
            {children}
          </div>
          {/* Duplicate strip — keeps the loop seamless. Hidden from a11y tree. */}
          <div
            className="flex shrink-0 items-center"
            style={{ gap: `${gap}px`, paddingRight: `${gap}px` }}
            aria-hidden="true"
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
);

Marquee.displayName = 'Marquee';
