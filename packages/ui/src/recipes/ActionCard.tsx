import React from 'react';
import { cn } from '../lib/cn';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import type { ButtonVariant } from '../components/Button';

export interface ActionCardProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  /** Action button label. */
  actionLabel?: string;
  onAction?: () => void;
  /** Variant for the action button. Default 'primary'. */
  actionVariant?: ButtonVariant;
  /** Custom slot — overrides actionLabel/onAction if provided. */
  action?: React.ReactNode;
  className?: string;
}

/**
 * ActionCard — Card + Icon + Heading + Description + Button recipe.
 * Used for "feature tile" patterns: empty-state CTAs, marketing tiles, settings entry points.
 */
export const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionVariant = 'primary',
  action,
  className,
}) => {
  return (
    <Card padding="lg" className={cn('flex flex-col gap-3', className)}>
      {icon && (
        <div className="w-10 h-10 rounded-[12px] bg-[var(--amp-semantic-bg-raised)] flex items-center justify-center text-[var(--amp-semantic-text-primary)]">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <h3 className="text-[16px] font-semibold text-[var(--amp-semantic-text-primary)]">{title}</h3>
        {description && (
          <p className="text-[13px] text-[var(--amp-semantic-text-secondary)]">{description}</p>
        )}
      </div>
      {(action || actionLabel) && (
        <div className="pt-2">
          {action ?? (
            <Button variant={actionVariant} size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};
