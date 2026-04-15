import { supabaseAdmin } from '@/lib/supabase/admin';
import { isSurveyActive, surveyExpiresAt } from '@/lib/utils';

/** Server-side check for anonymous/public survey flows (RLS also enforces this). */
export async function assertSurveyAcceptingPublicResponses(
  surveyId: string
): Promise<{ ok: true } | { ok: false; reason: 'not_found' | 'closed' }> {
  const { data: survey, error } = await supabaseAdmin
    .from('surveys')
    .select('is_active, start_date, end_date, expires_at')
    .eq('id', surveyId)
    .maybeSingle();

  if (error || !survey) {
    return { ok: false, reason: 'not_found' };
  }

  if (
    !isSurveyActive(
      survey.is_active,
      survey.start_date,
      surveyExpiresAt(survey)
    )
  ) {
    return { ok: false, reason: 'closed' };
  }

  return { ok: true };
}
