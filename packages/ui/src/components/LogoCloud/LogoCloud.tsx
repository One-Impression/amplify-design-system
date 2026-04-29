import React from 'react';
import { cn } from '../../lib/cn';

export interface LogoCloudItem {
  id?: string;
  /** Display name — used as alt text and as fallback content. */
  name: string;
  /** Optional logo image src. If absent, the name renders as styled text. */
  src?: string;
  /** Optional href if the logo should be a link. */
  href?: string;
  /** Optional pre-rendered React node (e.g. inline SVG). Takes precedence over src. */
  node?: React.ReactNode;
}

export type LogoCloudColorMode = 'greyscale' | 'colour' | 'colour-on-hover';

export interface LogoCloudProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Logos to display. */
  items: LogoCloudItem[];
  /** Optional title rendered above the logos. */
  title?: React.ReactNode;
  /** Colour treatment. Default greyscale matches typical "trusted by" rows. */
  colorMode?: LogoCloudColorMode;
  /** Visual density — number of logos per row at md+. */
  columns?: 3 | 4 | 5 | 6;
}

const columnsClass: Record<NonNullable<LogoCloudProps['columns']>, string> = {
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
  5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
};

const colorModeClass: Record<LogoCloudColorMode, string> = {
  greyscale: 'grayscale opacity-70',
  colour: '',
  // TODO(phase-a): swap to amplify-motion-* once phase A merges
  'colour-on-hover':
    'grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-[filter,opacity] duration-200',
};

export const LogoCloud = React.forwardRef<HTMLDivElement, LogoCloudProps>(
  ({ items, title, colorMode = 'greyscale', columns = 5, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {title && (
          <p className="text-center text-[14px] font-medium uppercase tracking-wider text-[var(--amp-semantic-text-secondary)] mb-8">
            {title}
          </p>
        )}
        <ul
          className={cn(
            'grid items-center gap-x-8 gap-y-6',
            columnsClass[columns]
          )}
        >
          {items.map((item, idx) => {
            const inner =
              item.node ??
              (item.src ? (
                <img
                  src={item.src}
                  alt={item.name}
                  className={cn('h-8 w-auto object-contain', colorModeClass[colorMode])}
                  loading="lazy"
                />
              ) : (
                <span
                  className={cn(
                    'text-[18px] font-semibold text-[var(--amp-semantic-text-secondary)]',
                    colorModeClass[colorMode]
                  )}
                >
                  {item.name}
                </span>
              ));
            return (
              <li
                key={item.id ?? idx}
                className="flex items-center justify-center"
              >
                {item.href ? (
                  <a
                    href={item.href}
                    aria-label={item.name}
                    className="inline-flex items-center justify-center"
                  >
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
);

LogoCloud.displayName = 'LogoCloud';
