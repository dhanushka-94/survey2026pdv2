'use client';

import { useMemo, useState } from 'react';

interface AllThreeInputProps {
  value: string | null;
  options: string[];
  onChange: (value: string | null) => void;
}

interface AllThreeValue {
  like: 'like' | 'dislike' | null;
  rating: string | null;
  checkboxes: string[];
}

export function AllThreeInput({ value, options, onChange }: AllThreeInputProps) {
  const parsed = useMemo<AllThreeValue>(() => {
    if (!value) return { like: null, rating: null, checkboxes: [] };
    try {
      const obj = JSON.parse(value);
      return {
        like: obj.like ?? null,
        rating: obj.rating ?? null,
        checkboxes: Array.isArray(obj.checkboxes) ? obj.checkboxes : [],
      };
    } catch {
      return { like: null, rating: null, checkboxes: [] };
    }
  }, [value]);

  const [like, setLike] = useState<'like' | 'dislike' | null>(parsed.like);
  const [rating, setRating] = useState<string | null>(parsed.rating);
  const [checkboxes, setCheckboxes] = useState<string[]>(parsed.checkboxes);

  const emit = (nextLike: typeof like, nextRating: typeof rating, nextCheckboxes: string[]) => {
    const next = { like: nextLike, rating: nextRating, checkboxes: nextCheckboxes };
    if (!next.like || !next.rating || next.checkboxes.length === 0) {
      onChange(null);
      return;
    }
    onChange(JSON.stringify(next));
  };

  const setLikeValue = (next: 'like' | 'dislike') => {
    setLike(next);
    emit(next, rating, checkboxes);
  };

  const setRatingValue = (next: string) => {
    setRating(next);
    emit(like, next, checkboxes);
  };

  const toggleCheckbox = (option: string) => {
    const next = checkboxes.includes(option)
      ? checkboxes.filter((v) => v !== option)
      : [...checkboxes, option];
    setCheckboxes(next);
    emit(like, rating, next);
  };

  return (
    <div className="space-y-5">
      <p className="text-sm font-medium text-muted-foreground">
        Complete all three sections to continue *
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => setLikeValue('like')} className={`rounded-lg border p-3 ${like === 'like' ? 'border-green-500 bg-green-50' : 'border-border'}`}>👍 Like</button>
        <button type="button" onClick={() => setLikeValue('dislike')} className={`rounded-lg border p-3 ${like === 'dislike' ? 'border-red-500 bg-red-50' : 'border-border'}`}>👎 Dislike</button>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <button key={num} type="button" onClick={() => setRatingValue(num.toString())} className={`rounded-lg border p-2 ${rating === num.toString() ? 'border-primary bg-primary text-white' : 'border-border'}`}>
            ⭐ {num}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {options.map((option) => (
          <label key={option} className={`flex items-center gap-2 rounded-lg border p-2 ${checkboxes.includes(option) ? 'border-primary bg-primary/5' : 'border-border'}`}>
            <input type="checkbox" checked={checkboxes.includes(option)} onChange={() => toggleCheckbox(option)} />
            <span className="text-sm">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
