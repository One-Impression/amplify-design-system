import React from 'react';
import { cn } from '../../lib/cn';

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  className,
  id,
}) => {
  const switchId = id || (label ? `switch-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <label
      htmlFor={switchId}
      className={cn(
        'inline-flex items-center gap-2 cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="relative">
        <input
          id={switchId}
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
          aria-checked={checked}
        />
        <div
          className={cn(
            'w-10 h-6 rounded-full transition-colors duration-150',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--amp-semantic-border-focus)]',
            checked
              ? 'bg-[var(--amp-semantic-accent)]'
              : 'bg-[var(--amp-semantic-bg-sunken)]'
          )}
        />
        <div
          className={cn(
            'absolute top-1 left-1 w-4 h-4 rounded-full transition-transform duration-150',
            'bg-[var(--amp-semantic-text-inverse)]',
            checked && 'translate-x-4'
          )}
        />
      </div>
      {label && (
        <span className="text-[14px] text-[var(--amp-semantic-text-primary)]">{label}</span>
      )}
    </label>
  );
};
