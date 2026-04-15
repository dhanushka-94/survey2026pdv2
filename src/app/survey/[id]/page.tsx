import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { hasSurveyExpired, hasSurveyStarted, surveyExpiresAt } from '@/lib/utils';
import { SurveyFlow } from '@/components/survey/SurveyFlow';
import { SurveyExpiryCountdown } from '@/components/survey/SurveyExpiryCountdown';
import { getActiveRewardForSurvey } from '@/actions/rewards';
import { Card, CardContent } from '@/components/ui/Card';

async function getSurveyData(id: string) {
  const { data: survey, error: surveyError } = await supabaseAdmin
    .from('surveys')
    .select('*')
    .eq('id', id)
    .single();

  if (surveyError || !survey) {
    return null;
  }

  // Hide inactive/expired surveys, but keep future-start surveys visible.
  if (!survey.is_active || hasSurveyExpired(surveyExpiresAt(survey))) {
    return null;
  }

  const startsInFuture = !hasSurveyStarted(survey.start_date);

  if (startsInFuture) {
    return {
      survey,
      categories: [],
      questions: [],
      finalReward: null,
      startsInFuture: true,
    };
  }

  // Get categories and questions
  const { data: categories, error: categoriesError } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('survey_id', id)
    .order('order_index', { ascending: true });

  const { data: questions, error: questionsError } = await supabaseAdmin
    .from('questions')
    .select('*')
    .eq('survey_id', id)
    .order('order_index', { ascending: true });

  if (categoriesError || questionsError) {
    return null;
  }

  const rewardResult = await getActiveRewardForSurvey(id);

  return {
    survey,
    categories: categories || [],
    questions: questions || [],
    finalReward: rewardResult.success ? rewardResult.data : null,
    startsInFuture: false,
  };
}

export default async function SurveyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const surveyData = await getSurveyData(id);

  if (!surveyData) {
    notFound();
  }

  if (surveyData.startsInFuture && surveyData.survey.start_date) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-pink-50 to-red-50 p-6">
        <Card className="max-w-xl w-full border-primary/20 shadow-2xl">
          <CardContent className="pt-10 pb-10 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {surveyData.survey.title}
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              This survey has not started yet.
            </p>
            <SurveyExpiryCountdown
              expiresAtIso={surveyData.survey.start_date}
              variant="hero"
              label="Starts in"
              expiredText="Survey is now open"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SurveyFlow
        survey={surveyData.survey}
        categories={surveyData.categories}
        questions={surveyData.questions}
        finalReward={surveyData.finalReward}
      />
    </div>
  );
}
