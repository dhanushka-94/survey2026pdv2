'use client';

import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({
  size = 'md',
  className,
  ...props
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn('flex items-center justify-center', className)}
      {...props}
    >
      <div
        className={cn('animate-spin rounded-full border-b-2 border-primary', {
          'h-5 w-5': size === 'sm',
          'h-8 w-8': size === 'md',
          'h-12 w-12': size === 'lg',
        })}
      />
    </div>
  );
}
