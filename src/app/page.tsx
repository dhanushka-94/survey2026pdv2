import { Suspense } from 'react';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { hasSurveyExpired, hasSurveyStarted, surveyExpiresAt } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { ClientSurveyRedirect } from '@/components/survey/ClientSurveyRedirect';
import { ClearHistoryButton } from '@/components/survey/ClearHistoryButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SurveySelector } from '@/components/survey/SurveySelector';

async function getAllActiveSurveys() {
  const { data: surveys, error } = await supabaseAdmin
    .from('surveys')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error || !surveys || surveys.length === 0) {
    return [];
  }

  // Keep active surveys that are not expired.
  // Future-start surveys remain visible so users can see countdown to start.
  const visibleSurveys = surveys.filter((survey) =>
    !hasSurveyExpired(surveyExpiresAt(survey))
  );

  return visibleSurveys;
}

export default async function Home() {
  // Get all active surveys
  const activeSurveys = await getAllActiveSurveys();

  // If there are multiple active surveys, show selector
  if (activeSurveys.length > 1) {
    return <SurveySelector surveys={activeSurveys} />;
  }

  // If there's only one survey and it has started, auto-redirect to it
  if (activeSurveys.length === 1) {
    const onlySurvey = activeSurveys[0];
    if (!hasSurveyStarted(onlySurvey.start_date)) {
      return <SurveySelector surveys={activeSurveys} />;
    }

    return (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-pink-50 to-red-50">
          <LoadingSpinner className="py-12" />
        </div>
      }>
        <ClientSurveyRedirect surveys={activeSurveys} />
      </Suspense>
    );
  }

  // If no active survey, show landing page
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-pink-50 to-red-50 p-6">
      <Card className="max-w-2xl w-full border-primary/20 shadow-2xl">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="mb-8">
            <div className="text-8xl mb-4 heart-pulse">💖</div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500 mb-3">
              You're All Caught Up!
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              You've completed all available surveys.
            </p>
            <p className="text-sm text-muted-foreground">
              Thank you for your valuable feedback! Check back later for new surveys. 💕
            </p>
          </div>

          {/* Privacy Assurance */}
          <div className="bg-primary-lighter border border-primary/30 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-3xl">✨</span>
              <h3 className="text-lg font-semibold text-primary">Thank You!</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Your anonymous responses help us improve. We truly appreciate your time and honest feedback!
            </p>
          </div>

          <div className="bg-muted/50 rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-3 font-medium">
              Want to retake a survey or clear your history?
            </p>
            <ClearHistoryButton />
            <p className="text-xs text-muted-foreground mt-2">
              This will let you retake surveys (for testing)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
