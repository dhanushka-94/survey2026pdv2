'use client';

import { useMemo } from 'react';

interface MultiCheckboxInputProps {
  value: string | null;
  options: string[];
  onChange: (value: string | null) => void;
}

export function MultiCheckboxInput({ value, options, onChange }: MultiCheckboxInputProps) {
  const selected = useMemo<string[]>(() => {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [value]);

  const toggleOption = (option: string) => {
    const exists = selected.includes(option);
    const next = exists ? selected.filter((o) => o !== option) : [...selected, option];
    onChange(next.length > 0 ? JSON.stringify(next) : null);
  };

  if (!options || options.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No checkbox options configured for this question.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-muted-foreground">
        Select one or more options *
      </p>
      <div className="space-y-2">
        {options.map((option) => {
          const checked = selected.includes(option);
          return (
            <label
              key={option}
              className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                checked ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/30'
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleOption(option)}
                className="h-4 w-4"
              />
              <span className="text-sm">{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
