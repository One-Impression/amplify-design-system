import React from 'react';
import { cn } from '../../lib/cn';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-[12px]',
  md: 'w-10 h-10 text-[14px]',
  lg: 'w-14 h-14 text-[18px]',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  initials,
  size = 'md',
  className,
}) => {
  const [imgError, setImgError] = React.useState(false);

  const showFallback = !src || imgError;

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full overflow-hidden flex-shrink-0',
        showFallback && 'bg-[var(--amp-semantic-accent)] text-[var(--amp-semantic-text-inverse)]',
        sizeClasses[size],
        className
      )}
      aria-label={alt || initials}
      role="img"
    >
      {!showFallback ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-medium select-none">
          {initials?.slice(0, 2).toUpperCase() || '?'}
        </span>
      )}
    </div>
  );
};
