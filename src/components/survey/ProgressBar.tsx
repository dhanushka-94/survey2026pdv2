'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  total: number;
  categoryName?: string;
}

export function ProgressBar({ current, total, categoryName }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl">💖</span>
          <div>
            <span className="text-xs sm:text-sm font-medium text-foreground">
              Question {current} of {total}
            </span>
            {categoryName && (
              <span className="ml-2 text-xs sm:text-sm text-muted-foreground hidden sm:inline">
                • {categoryName}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] sm:text-xs text-muted-foreground">🔒 Anonymous</span>
          <span className="text-xs sm:text-sm font-bold text-primary">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
      <div className="w-full bg-gradient-to-r from-primary-lighter to-pink-50 rounded-full h-2 sm:h-3 border border-primary/20">
        <div
          className="bg-gradient-to-r from-primary to-pink-500 h-full rounded-full transition-all duration-500 shadow-sm"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-[10px] sm:text-xs text-center text-muted-foreground mt-2">
        Your responses are completely anonymous & secure
      </p>
    </div>
  );
}
