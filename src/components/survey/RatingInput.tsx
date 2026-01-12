'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface RatingInputProps {
  value: string | null;
  onChange: (value: string) => void;
}

export function RatingInput({ value, onChange }: RatingInputProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const selectedRating = value ? parseInt(value) : 0;

  const ratings = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6">
      <div className="text-center px-4">
        <p className="text-base sm:text-lg font-semibold text-foreground mb-1 flex items-center justify-center gap-2">
          <span className="text-xl sm:text-2xl">💕</span>
          How much do you love it?
        </p>
        <p className="text-xs text-muted-foreground">
          Tap to rate from 1 to 5 hearts *
        </p>
      </div>
      <div className="flex justify-center gap-1 sm:gap-2 px-2">
        {ratings.map((rating) => {
          const isSelected = selectedRating >= rating;
          const isHovered = hoveredRating >= rating;
          const showFilled = isSelected || isHovered;
          
          return (
            <button
              key={rating}
              type="button"
              onClick={() => onChange(rating.toString())}
              onMouseEnter={() => setHoveredRating(rating)}
              onMouseLeave={() => setHoveredRating(0)}
              className="group relative transition-all hover:scale-110 active:scale-95 touch-manipulation p-1"
            >
              <div
                className={cn(
                  'flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all',
                  showFilled ? 'scale-110 drop-shadow-lg' : 'scale-100'
                )}
              >
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 transition-all"
                  fill={showFilled ? '#E63946' : '#ffc0c7'}
                  viewBox="0 0 24 24"
                >
                  <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                </svg>
              </div>
              <span
                className={cn(
                  'absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs font-medium',
                  showFilled ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {rating}
              </span>
            </button>
          );
        })}
      </div>
      {selectedRating > 0 && (
        <p className="text-sm text-primary font-medium">
          You selected: {selectedRating}/5
        </p>
      )}
    </div>
  );
}
