import React from 'react';
import { Button } from '../Button/Button';

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action, icon, className }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className || ''}`}>
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-surface-raised flex items-center justify-center mb-4 text-neutral-500">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-neutral-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-neutral-700 max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <Button variant="primary" size="md" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};
