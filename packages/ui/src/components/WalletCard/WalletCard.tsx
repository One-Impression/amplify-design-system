import React from 'react';
import { cn } from '../../lib/cn';
import { Card } from '../Card';

/**
 * WalletCard — opinionated preset wrapper around `<Card>` for the OI Money
 * balance tile. Header (label + amount), body (progress), footer (messages).
 *
 * Backward-compatible: existing public props are preserved exactly.
 * Migration hint: see `component-status.json` (`replacedBy: "Card"`).
 */

export interface WalletCardProps extends React.HTMLAttributes<HTMLDivElement> {
  balance: number;
  currency?: string;
  percentage?: number;
  topupMessage?: string;
  subtitle?: string;
}

function formatBalance(amount: number, currency: string): string {
  return `${currency}${amount.toLocaleString('en-IN')}`;
}

export const WalletCard = React.forwardRef<HTMLDivElement, WalletCardProps>(
  (
    {
      balance,
      currency = '₹',
      percentage = 0,
      topupMessage,
      subtitle,
      className,
      ...props
    },
    ref,
  ) => {
    const clampedPct = Math.max(0, Math.min(100, percentage));

    return (
      <Card
        ref={ref as React.Ref<HTMLElement>}
        variant="default"
        padding="none"
        className={cn(
          'flex flex-col gap-3 rounded-lg border-violet-200 bg-violet-50 px-4 py-4',
          className,
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-stone-600">OI Money Balance</span>
          <span className="text-lg font-bold text-violet-600">
            {formatBalance(balance, currency)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-violet-200">
          <div
            className="h-full rounded-full bg-violet-600 transition-all duration-300"
            style={{ width: `${clampedPct}%` }}
            role="progressbar"
            aria-valuenow={clampedPct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        {/* Topup message */}
        {topupMessage && <p className="text-xs text-stone-500">{topupMessage}</p>}

        {/* Subtitle */}
        {subtitle && <p className="text-xs text-violet-600">{subtitle}</p>}
      </Card>
    );
  },
);

WalletCard.displayName = 'WalletCard';
