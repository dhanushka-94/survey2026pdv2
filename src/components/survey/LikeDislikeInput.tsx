'use client';

import { cn } from '@/lib/utils';

interface LikeDislikeInputProps {
  value: string | null;
  onChange: (value: string) => void;
}

export function LikeDislikeInput({ value, onChange }: LikeDislikeInputProps) {
  return (
    <div className="space-y-4">
      <p className="text-center text-sm font-medium text-muted-foreground">
        Please select one option *
      </p>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => onChange('like')}
          className={cn(
            "group relative overflow-hidden rounded-xl sm:rounded-2xl border-2 bg-gradient-to-br from-white to-primary-lighter p-4 sm:p-6 transition-all hover:shadow-lg active:scale-95",
            value === 'like' 
              ? 'border-primary ring-2 ring-primary/30 scale-[1.02]' 
              : 'border-primary/30 hover:border-primary'
          )}
        >
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <div className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform">💖</div>
            <span className="text-base sm:text-lg font-bold text-primary">
              Love It!
            </span>
          </div>
          {value === 'like' && (
            <div className="absolute top-2 right-2 text-primary text-lg">✓</div>
          )}
        </button>

        <button
          type="button"
          onClick={() => onChange('dislike')}
          className={cn(
            "group relative overflow-hidden rounded-xl sm:rounded-2xl border-2 bg-gradient-to-br from-white to-gray-50 p-4 sm:p-6 transition-all hover:shadow-lg active:scale-95",
            value === 'dislike' 
              ? 'border-gray-500 ring-2 ring-gray-300 scale-[1.02]' 
              : 'border-gray-300 hover:border-gray-500'
          )}
        >
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <div className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform">💔</div>
            <span className="text-base sm:text-lg font-bold text-gray-600">
              Not for me
            </span>
          </div>
          {value === 'dislike' && (
            <div className="absolute top-2 right-2 text-gray-600 text-lg">✓</div>
          )}
        </button>
      </div>
    </div>
  );
}
