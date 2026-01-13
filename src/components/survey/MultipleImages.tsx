'use client';

import { useState, useEffect } from 'react';
import { trackMediaView } from '@/actions/tracking';

interface MultipleImagesProps {
  urls: string[];
  alt?: string;
  surveyId?: string;
  questionId?: string;
  sessionId?: string;
}

export function MultipleImages({ 
  urls, 
  alt = 'Media content',
  surveyId,
  questionId,
  sessionId,
}: MultipleImagesProps) {
  const [revealedImages, setRevealedImages] = useState<Set<number>>(new Set());
  const [hasTrackedAny, setHasTrackedAny] = useState(false);

  // Reset when question changes
  useEffect(() => {
    setRevealedImages(new Set());
    setHasTrackedAny(false);
  }, [questionId]);

  const handleReveal = async (index: number) => {
    setRevealedImages(prev => new Set(prev).add(index));
    
    // Track media view (only once per question, not per image)
    if (!hasTrackedAny && surveyId && questionId && sessionId) {
      setHasTrackedAny(true);
      await trackMediaView({
        survey_id: surveyId,
        question_id: questionId,
        session_id: sessionId,
      });
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-muted-foreground">
        {urls.length} image{urls.length > 1 ? 's' : ''} • Click to view
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {urls.map((url, index) => {
          const isRevealed = revealedImages.has(index);
          
          return (
            <div key={index} className="relative">
              {/* Image */}
              <img
                src={url}
                alt={`${alt} ${index + 1}`}
                className={`w-full rounded-lg transition-all duration-500 ${
                  isRevealed ? 'blur-0' : 'blur-2xl'
                }`}
              />

              {/* Overlay - shown when blurred */}
              {!isRevealed && (
                <button
                  onClick={() => handleReveal(index)}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-lg cursor-pointer hover:bg-black/50 transition-colors"
                >
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg text-center">
                    <div className="text-2xl mb-1">👁️</div>
                    <p className="text-xs font-medium text-gray-800">
                      Tap to view
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Image {index + 1}/{urls.length}
                    </p>
                  </div>
                </button>
              )}

              {/* Image number badge */}
              {isRevealed && (
                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full font-medium">
                  {index + 1}/{urls.length}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* View Status */}
      <div className="text-xs text-center text-muted-foreground">
        Viewed: {revealedImages.size} / {urls.length} images
      </div>
    </div>
  );
}
