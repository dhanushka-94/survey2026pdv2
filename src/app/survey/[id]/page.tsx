import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { isSurveyActive } from '@/lib/utils';
import { SurveyFlow } from '@/components/survey/SurveyFlow';

async function getSurveyData(id: string) {
  const { data: survey, error: surveyError } = await supabase
    .from('surveys')
    .select('*')
    .eq('id', id)
    .single();

  if (surveyError || !survey) {
    return null;
  }

  // Check if survey is active
  if (!isSurveyActive(survey.is_active, survey.start_date, survey.end_date)) {
    return null;
  }

  // Get categories and questions
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .eq('survey_id', id)
    .order('order_index', { ascending: true });

  const { data: questions, error: questionsError } = await supabase
    .from('questions')
    .select('*')
    .eq('survey_id', id)
    .order('order_index', { ascending: true });

  if (categoriesError || questionsError) {
    return null;
  }

  return {
    survey,
    categories: categories || [],
    questions: questions || [],
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

  return (
    <div className="min-h-screen bg-background">
      <SurveyFlow
        survey={surveyData.survey}
        categories={surveyData.categories}
        questions={surveyData.questions}
      />
    </div>
  );
}
