'use client';

import { useState, useEffect } from 'react';
import { trackMediaView } from '@/actions/tracking';

interface BlurredMediaProps {
  src: string;
  alt?: string;
  type: 'image' | 'video';
  surveyId?: string;
  questionId?: string;
  sessionId?: string;
}

export function BlurredMedia({ 
  src, 
  alt = 'Media content', 
  type,
  surveyId,
  questionId,
  sessionId,
}: BlurredMediaProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasTracked, setHasTracked] = useState(false);

  // Reset to hidden state when question changes (new question = hidden image)
  useEffect(() => {
    setIsRevealed(false);
    setHasTracked(false);
  }, [questionId]);

  const handleReveal = async () => {
    setIsRevealed(true);
    
    // Track the media view (only once per session)
    if (!hasTracked && surveyId && questionId && sessionId) {
      setHasTracked(true);
      await trackMediaView({
        survey_id: surveyId,
        question_id: questionId,
        session_id: sessionId,
      });
    }
  };

  if (type === 'video') {
    // Videos don't get blurred, just show with controls
    return (
      <video
        src={src}
        controls
        className="w-full max-w-2xl rounded-lg mx-auto"
      />
    );
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Image */}
      <img
        src={src}
        alt={alt}
        className={`w-full rounded-lg transition-all duration-500 ${
          isRevealed ? 'blur-0' : 'blur-2xl'
        }`}
      />

      {/* Overlay - shown when blurred, click to reveal (cannot hide again) */}
      {!isRevealed && (
        <button
          onClick={handleReveal}
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-lg cursor-pointer hover:bg-black/50 transition-colors"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg text-center">
            <div className="text-3xl mb-2">👁️</div>
            <p className="text-sm font-medium text-gray-800">
              Tap to view image
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Content may be sensitive
            </p>
          </div>
        </button>
      )}

      {/* No hide button - once revealed, stays revealed until next question */}
    </div>
  );
}
