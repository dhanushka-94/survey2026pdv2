'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { hasCompletedSurvey, renewSessionId } from '@/lib/utils';
import type { Survey } from '@/lib/types';

interface ClientSurveyRedirectProps {
  surveys: Survey[];
}

export function ClientSurveyRedirect({ surveys }: ClientSurveyRedirectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNewSession = searchParams.get('new') === 'true';

  useEffect(() => {
    // If user wants a new session (clicked "Take Another Survey")
    if (isNewSession) {
      // Clear completed surveys to allow retaking
      if (typeof window !== 'undefined') {
        localStorage.removeItem('completed_surveys');
      }
      // Note: renewSessionId() is not needed here as session was already ended
      // A new session will be created automatically when the survey loads
    }

    // Find the first survey that hasn't been completed
    const availableSurvey = surveys.find(survey => !hasCompletedSurvey(survey.id));

    if (availableSurvey) {
      // Redirect to the first uncompleted survey
      setTimeout(() => {
        router.push(`/survey/${availableSurvey.id}`);
      }, 100);
    } else if (surveys.length > 0 && isNewSession) {
      // If new session requested and surveys exist, go to first one (allow retake)
      setTimeout(() => {
        router.push(`/survey/${surveys[0].id}`);
      }, 100);
    } else {
      // All surveys completed, refresh to show "all completed" message
      router.refresh();
    }
  }, [surveys, router, isNewSession]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-pink-50 to-red-50">
      <div className="text-center max-w-md px-6">
        <div className="text-6xl mb-4 heart-pulse">💖</div>
        <p className="text-lg text-muted-foreground mb-2">Loading survey...</p>
        <p className="text-sm text-muted-foreground">
          Found {surveys.length} active survey{surveys.length !== 1 ? 's' : ''}
        </p>
        {surveys.length === 0 && (
          <p className="text-xs text-red-500 mt-2">
            No surveys found. Please create one in the admin dashboard.
          </p>
        )}
      </div>
    </div>
  );
}
