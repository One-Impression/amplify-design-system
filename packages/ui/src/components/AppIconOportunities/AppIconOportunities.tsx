'use client';

import React from 'react';
import { cn } from '../../lib/cn';

/**
 * AppIconOportunities — the locked V1 "op." app icon as a React component.
 *
 * Used in the marketing site, app store mockups, and anywhere the brand
 * mark needs to appear as a square icon. The shape is an iOS-style
 * squircle (border-radius ≈ 22.37% — the iOS continuous-corner radius).
 *
 * Layout: cream background, Geist 600 "op" in dark text, apricot period.
 * In dark mode (`dark={true}`) the background flips to ink, the letters
 * lighten, and the apricot period brightens to maintain contrast.
 *
 * Tokens consumed:
 *   --amp-oportunities-theme-color-bg            (light surface)
 *   --amp-oportunities-theme-color-bg-elev       (light contrast surface)
 *   --amp-oportunities-theme-color-text-primary  (letters in light)
 *   --amp-oportunities-theme-color-accent        (period)
 *   --amp-oportunities-font-display              (Geist)
 *   --amp-oportunities-letter-spacing-tight      (-0.04em)
 *
 * The icon ships with no motion — app icons are static by spec.
 */

export interface AppIconOportunitiesProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Pixel size of the (square) icon. Default 64. */
  size?: number;
  /** Render the dark variant (dark bg + lighter letters + brighter period). */
  dark?: boolean;
  /** Override the accessible label. Default 'Oportunities app icon'. */
  label?: string;
  className?: string;
}

// iOS continuous-corner squircle radius — 22.37% of the icon side.
const SQUIRCLE_RADIUS_RATIO = 0.2237;

// Light theme — cream bg + warm-ink letters + apricot period.
const LIGHT_BG = '#FDF8F3';
const LIGHT_LETTERS = '#1C1611';

// Dark theme — deep ink bg + warm cream letters + brighter apricot period.
const DARK_BG = '#15110D';
const DARK_LETTERS = '#F4ECE0';
const DARK_PERIOD = '#FFAE6B';

export const AppIconOportunities = React.forwardRef<HTMLSpanElement, AppIconOportunitiesProps>(
  ({ size = 64, dark = false, label = 'Oportunities app icon', className, style, ...rest }, ref) => {
    const radius = Math.round(size * SQUIRCLE_RADIUS_RATIO);
    // Tune internal type so "op." sits visually centred. Pull a hair to the left
    // optically to balance the trailing period on the right.
    const fontSize = Math.round(size * 0.46);

    const bg = dark ? DARK_BG : 'var(--amp-oportunities-theme-color-bg, #FDF8F3)';
    const letterColor = dark ? DARK_LETTERS : 'var(--amp-oportunities-theme-color-text-primary, #1C1611)';
    const periodColor = dark ? DARK_PERIOD : 'var(--amp-oportunities-theme-color-accent, #E68F47)';

    // Fallback static colours when CSS vars are not loaded, so the icon
    // renders identically inside isolated marketing pages too.
    const fallbackBg = dark ? DARK_BG : LIGHT_BG;
    const fallbackLetter = dark ? DARK_LETTERS : LIGHT_LETTERS;

    return (
      <span
        ref={ref}
        role="img"
        aria-label={label}
        data-dark={dark}
        className={cn('inline-flex items-center justify-center select-none overflow-hidden', className)}
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          background: bg,
          backgroundColor: fallbackBg,
          fontFamily: 'var(--amp-oportunities-font-display, "Geist", "Inter Tight", sans-serif)',
          fontWeight: 'var(--amp-oportunities-weight-display, 600)',
          letterSpacing: 'var(--amp-oportunities-letter-spacing-tight, -0.04em)',
          color: fallbackLetter,
          fontSize,
          lineHeight: 1,
          // Match the iOS app-icon subtle outline so cards on cream/white
          // backgrounds don't disappear into the surface.
          boxShadow: dark
            ? '0 1px 0 rgba(255,255,255,0.04) inset'
            : '0 0 0 1px rgba(28,22,17,0.06) inset',
          ...style,
        }}
        {...rest}
      >
        <span aria-hidden="true" style={{ color: letterColor }}>
          op
        </span>
        <span
          aria-hidden="true"
          data-testid="app-icon-period"
          style={{ color: periodColor, marginLeft: Math.max(1, Math.round(size * 0.01)) }}
        >
          .
        </span>
      </span>
    );
  },
);

AppIconOportunities.displayName = 'AppIconOportunities';
