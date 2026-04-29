'use client';

import React from 'react';
import { Reveal, RevealDirection, RevealTrigger } from '../Reveal/Reveal';
import { cn } from '../../lib/cn';

export interface StaggerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Delay (ms) between each child's reveal. Default 80. */
  interval?: number;
  /** Initial delay before first child starts. Default 0. */
  initialDelay?: number;
  /** Direction passed through to each Reveal. */
  direction?: RevealDirection;
  /** Per-child duration. Default 500. */
  duration?: number;
  /** Trigger mode passed through to each Reveal. Default 'scroll'. */
  trigger?: RevealTrigger;
  /** Wrap each child in a Reveal even if it already provides motion. Default true. */
  wrapChildren?: boolean;
  /** Optional element type for the container. Default 'div'. */
  as?: keyof React.JSX.IntrinsicElements;
  children: React.ReactNode;
}

export const Stagger: React.FC<StaggerProps> = ({
  interval = 80,
  initialDelay = 0,
  direction = 'up',
  duration = 500,
  trigger = 'scroll',
  wrapChildren = true,
  as = 'div',
  className,
  children,
  ...rest
}) => {
  const Tag = as as React.ElementType;
  const items = React.Children.toArray(children);

  return (
    <Tag className={cn(className)} {...rest}>
      {items.map((child, i) => {
        const delay = initialDelay + i * interval;
        if (!wrapChildren) {
          // Caller supplies their own Reveal — we just pass an inline style for delay coord.
          if (React.isValidElement(child)) {
            const existingStyle = (child.props as { style?: React.CSSProperties }).style;
            return React.cloneElement(child as React.ReactElement<{ style?: React.CSSProperties }>, {
              style: { transitionDelay: `${delay}ms`, ...existingStyle },
            });
          }
          return child;
        }
        return (
          <Reveal
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            delay={delay}
            direction={direction}
            duration={duration}
            trigger={trigger}
          >
            {child}
          </Reveal>
        );
      })}
    </Tag>
  );
};
