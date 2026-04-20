import React from 'react';
import { cn } from '../../lib/cn';

export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  className,
  id,
}) => {
  const checkboxId = id || (label ? `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <label
      htmlFor={checkboxId}
      className={cn(
        'inline-flex items-center gap-2 cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="relative">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div
          className={cn(
            'w-5 h-5 rounded-[4px] border-2 transition-colors duration-150 flex items-center justify-center',
            'border-[var(--amp-semantic-border-default)]',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--amp-semantic-border-focus)]',
            checked && 'bg-[var(--amp-semantic-accent)] border-[var(--amp-semantic-accent)]'
          )}
        >
          {checked && (
            <svg className="w-3 h-3 text-[var(--amp-semantic-text-inverse)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      {label && (
        <span className="text-[14px] text-[var(--amp-semantic-text-primary)]">{label}</span>
      )}
    </label>
  );
};
