'use client';

import { useState } from 'react';

interface CombinedInputProps {
  value: string | null;
  onChange: (value: string) => void;
}

export function CombinedInput({ value, onChange }: CombinedInputProps) {
  // Parse existing value
  const parsedValue = value ? JSON.parse(value) : { like: null, rating: null };
  const [like, setLike] = useState<string | null>(parsedValue.like);
  const [rating, setRating] = useState<string | null>(parsedValue.rating);

  const handleLikeChange = (newLike: string) => {
    setLike(newLike);
    const combined = { like: newLike, rating };
    onChange(JSON.stringify(combined));
  };

  const handleRatingChange = (newRating: string) => {
    setRating(newRating);
    const combined = { like, rating: newRating };
    onChange(JSON.stringify(combined));
  };

  const isComplete = like !== null && rating !== null;

  return (
    <div className="space-y-6">
      {/* Like/Dislike Section */}
      <div>
        <p className="text-sm font-semibold text-foreground mb-3">
          1. Do you like or dislike this? <span className="text-red-500">*</span>
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleLikeChange('like')}
            className={`p-4 rounded-xl border-2 transition-all ${
              like === 'like'
                ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                : 'border-border bg-background hover:border-green-300 hover:bg-green-50/50'
            }`}
          >
            <div className="text-4xl mb-2">👍</div>
            <p className={`font-semibold ${like === 'like' ? 'text-green-700' : 'text-foreground'}`}>
              Like
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleLikeChange('dislike')}
            className={`p-4 rounded-xl border-2 transition-all ${
              like === 'dislike'
                ? 'border-red-500 bg-red-50 shadow-lg scale-105'
                : 'border-border bg-background hover:border-red-300 hover:bg-red-50/50'
            }`}
          >
            <div className="text-4xl mb-2">👎</div>
            <p className={`font-semibold ${like === 'dislike' ? 'text-red-700' : 'text-foreground'}`}>
              Dislike
            </p>
          </button>
        </div>
      </div>

      {/* Rating Section */}
      <div>
        <p className="text-sm font-semibold text-foreground mb-3">
          2. How would you rate it? <span className="text-red-500">*</span>
        </p>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleRatingChange(num.toString())}
              className={`p-3 rounded-xl border-2 transition-all ${
                rating === num.toString()
                  ? 'border-primary bg-primary text-white shadow-lg scale-110'
                  : 'border-border bg-background hover:border-primary hover:bg-primary/10'
              }`}
            >
              <div className="text-2xl mb-1">⭐</div>
              <p className={`text-lg font-bold ${rating === num.toString() ? 'text-white' : 'text-primary'}`}>
                {num}
              </p>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          1 = Poor | 5 = Excellent
        </p>
      </div>

      {/* Completion Indicator */}
      {isComplete && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-sm font-medium text-green-700">
            ✅ Both answers selected! You can proceed.
          </p>
        </div>
      )}

      {!isComplete && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <p className="text-sm font-medium text-yellow-700">
            ⚠️ Please answer both questions above to continue
          </p>
        </div>
      )}
    </div>
  );
}
