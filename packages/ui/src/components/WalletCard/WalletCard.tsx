import React from 'react';
import { cn } from '../../lib/cn';

export interface WalletCardProps extends React.HTMLAttributes<HTMLDivElement> {
  balance: string;
  label?: string;
}

export const WalletCard = React.forwardRef<HTMLDivElement, WalletCardProps>(
  ({ balance, label = 'Wallet Balance', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('rounded-xl border border-stone-200 bg-white p-4', className)}
        {...props}
      >
        <span className="text-xs text-stone-500">{label}</span>
        <p className="text-lg font-semibold text-stone-900">{balance}</p>
      </div>
    );
  }
);

WalletCard.displayName = 'WalletCard';
