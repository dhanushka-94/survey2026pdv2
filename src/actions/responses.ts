'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { AggregatedResults, QuestionResult } from '@/lib/types';

export async function getResponses(surveyId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('responses')
      .select('*')
      .eq('survey_id', surveyId);

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Get responses error:', error);
    return { success: false, error: 'Failed to fetch responses' };
  }
}

export async function getAggregatedResults(surveyId: string): Promise<{ success: boolean; data?: AggregatedResults; error?: string }> {
  try {
    // Get all responses for the survey
    const { data: responses, error: responsesError } = await supabaseAdmin
      .from('responses')
      .select('*')
      .eq('survey_id', surveyId);

    if (responsesError) throw responsesError;

    // Get all questions for the survey
    const { data: questions, error: questionsError } = await supabaseAdmin
      .from('questions')
      .select('*')
      .eq('survey_id', surveyId);

    if (questionsError) throw questionsError;

    if (!responses || !questions) {
      return {
        success: true,
        data: {
          survey_id: surveyId,
          total_responses: 0,
          by_age: {} as any,
          by_gender: {} as any,
          by_device: {},
          by_browser: {},
          by_os: {},
          questions: [],
        },
      };
    }

    // Calculate aggregations
    const byAge: Record<string, number> = {};
    const byGender: Record<string, number> = {};
    const byDevice: Record<string, number> = {};
    const byBrowser: Record<string, number> = {};
    const byOs: Record<string, number> = {};

    // Track unique sessions to avoid counting device info multiple times
    const sessionDevices: Record<string, { device: string; browser: string; os: string }> = {};

    responses.forEach((response) => {
      byAge[response.age_range] = (byAge[response.age_range] || 0) + 1;
      byGender[response.gender] = (byGender[response.gender] || 0) + 1;
      
      // Track device info per session (only count once per session)
      if (!sessionDevices[response.session_id]) {
        const device = response.device_type || 'desktop';
        const browser = response.browser || 'Unknown';
        const os = response.os || 'Unknown';
        
        sessionDevices[response.session_id] = { device, browser, os };
        
        byDevice[device] = (byDevice[device] || 0) + 1;
        byBrowser[browser] = (byBrowser[browser] || 0) + 1;
        byOs[os] = (byOs[os] || 0) + 1;
      }
    });

    // Aggregate by question
    const questionResults: QuestionResult[] = questions.map((question) => {
      const questionResponses = responses.filter(
        (r) => r.question_id === question.id
      );

      const result: QuestionResult = {
        question_id: question.id,
        question_text: question.question_text,
        question_type: question.question_type,
        total_responses: questionResponses.length,
      };

      if (question.question_type === 'like_dislike') {
        result.like_count = questionResponses.filter(
          (r) => r.answer_value === 'like'
        ).length;
        result.dislike_count = questionResponses.filter(
          (r) => r.answer_value === 'dislike'
        ).length;
      } else if (question.question_type === 'rating_1_5') {
        result.rating_1 = questionResponses.filter((r) => r.answer_value === '1').length;
        result.rating_2 = questionResponses.filter((r) => r.answer_value === '2').length;
        result.rating_3 = questionResponses.filter((r) => r.answer_value === '3').length;
        result.rating_4 = questionResponses.filter((r) => r.answer_value === '4').length;
        result.rating_5 = questionResponses.filter((r) => r.answer_value === '5').length;

        const sum = questionResponses.reduce(
          (acc, r) => acc + parseInt(r.answer_value),
          0
        );
        result.average_rating = questionResponses.length > 0
          ? sum / questionResponses.length
          : 0;
      }

      return result;
    });

    // Get unique session count
    const uniqueSessions = new Set(responses.map((r) => r.session_id));

    return {
      success: true,
      data: {
        survey_id: surveyId,
        total_responses: uniqueSessions.size,
        by_age: byAge,
        by_gender: byGender,
        by_device: byDevice,
        by_browser: byBrowser,
        by_os: byOs,
        questions: questionResults,
      },
    };
  } catch (error) {
    console.error('Get aggregated results error:', error);
    return { success: false, error: 'Failed to fetch aggregated results' };
  }
}

// Get individual responses grouped by user/session
export interface IndividualAnswer {
  question_id: string;
  question_text: string;
  question_type: string;
  answer_value: string;
  time_spent_seconds: number;
  has_media: boolean;
  media_url: string | null;
  media_urls?: string[] | null;
  media_viewed: boolean;
}

export interface IndividualResponse {
  session_id: string;
  display_name: string; // e.g., "iPhone Safari #1"
  age_range: string;
  gender: string;
  device_type: string;
  browser: string;
  os: string;
  submitted_at: string;
  total_time_seconds: number;
  answers: IndividualAnswer[];
}

export async function getIndividualResponses(surveyId: string): Promise<{ 
  success: boolean; 
  data?: IndividualResponse[]; 
  error?: string 
}> {
  try {
    // Get all responses with question info
    const { data: responses, error: responsesError } = await supabaseAdmin
      .from('responses')
      .select(`
        *,
        question:questions(id, question_text, question_type, media_url, media_urls)
      `)
      .eq('survey_id', surveyId)
      .order('created_at', { ascending: true });

    if (responsesError) throw responsesError;

    // Get all media views for this survey
    const { data: mediaViews, error: mediaViewsError } = await supabaseAdmin
      .from('media_views')
      .select('question_id, session_id')
      .eq('survey_id', surveyId);

    if (mediaViewsError) throw mediaViewsError;

    // Create a set of viewed media for quick lookup
    const viewedMedia = new Set(
      (mediaViews || []).map(mv => `${mv.session_id}-${mv.question_id}`)
    );

    if (!responses || responses.length === 0) {
      return { success: true, data: [] };
    }

    // Group responses by session_id
    const sessionMap: Record<string, IndividualResponse> = {};

    // Track device names for numbering
    const deviceCounter: Record<string, number> = {};

    responses.forEach((response: any) => {
      const sid = response.session_id;
      
      if (!sessionMap[sid]) {
        const deviceType = response.device_type || 'desktop';
        const browser = response.browser || 'Unknown';
        
        // Create device identifier for numbering
        const deviceKey = `${deviceType}-${browser}`;
        deviceCounter[deviceKey] = (deviceCounter[deviceKey] || 0) + 1;
        
        // Create display name like "iPhone Safari #1" or "Desktop Chrome #2"
        const deviceLabel = deviceType === 'mobile' ? '📱' : deviceType === 'tablet' ? '📲' : '🖥️';
        const displayName = `${deviceLabel} ${browser} #${deviceCounter[deviceKey]}`;
        
        sessionMap[sid] = {
          session_id: sid,
          display_name: displayName,
          age_range: response.age_range,
          gender: response.gender,
          device_type: deviceType,
          browser: browser,
          os: response.os || 'Unknown',
          submitted_at: response.created_at,
          total_time_seconds: 0,
          answers: [],
        };
      }
      
      const timeSpent = response.time_spent_seconds || 0;
      const hasMedia = !!response.question?.media_url || (response.question?.media_urls && response.question.media_urls.length > 0);
      const mediaViewed = viewedMedia.has(`${sid}-${response.question_id}`);
      
      sessionMap[sid].answers.push({
        question_id: response.question_id,
        question_text: response.question?.question_text || 'Unknown',
        question_type: response.question?.question_type || 'unknown',
        answer_value: response.answer_value,
        time_spent_seconds: timeSpent,
        has_media: hasMedia,
        media_url: response.question?.media_url || null,
        media_urls: response.question?.media_urls || null,
        media_viewed: mediaViewed,
      });
      
      // Update total time
      sessionMap[sid].total_time_seconds += timeSpent;
      
      // Update submitted_at to the latest answer time
      if (new Date(response.created_at) > new Date(sessionMap[sid].submitted_at)) {
        sessionMap[sid].submitted_at = response.created_at;
      }
    });

    // Convert to array and sort by submission time (newest first)
    const individuals = Object.values(sessionMap).sort(
      (a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
    );

    return { success: true, data: individuals };
  } catch (error) {
    console.error('Get individual responses error:', error);
    return { success: false, error: 'Failed to fetch individual responses' };
  }
}

// Delete a single response by ID
export async function deleteResponse(responseId: string, surveyId: string) {
  try {
    const { error } = await supabaseAdmin
      .from('responses')
      .delete()
      .eq('id', responseId);

    if (error) throw error;

    revalidatePath(`/[admin]/surveys/${surveyId}/responses`);
    revalidatePath(`/[admin]/surveys/${surveyId}/results`);
    return { success: true };
  } catch (error) {
    console.error('Delete response error:', error);
    return { success: false, error: 'Failed to delete response' };
  }
}

// Delete all responses for a session (one user's complete survey response)
export async function deleteSessionResponses(sessionId: string, surveyId: string) {
  try {
    const { error } = await supabaseAdmin
      .from('responses')
      .delete()
      .eq('session_id', sessionId)
      .eq('survey_id', surveyId);

    if (error) throw error;

    // Also delete related media views and session tracking
    await supabaseAdmin
      .from('media_views')
      .delete()
      .eq('session_id', sessionId)
      .eq('survey_id', surveyId);

    await supabaseAdmin
      .from('session_tracking')
      .delete()
      .eq('session_id', sessionId)
      .eq('survey_id', surveyId);

    revalidatePath(`/[admin]/surveys/${surveyId}/responses`);
    revalidatePath(`/[admin]/surveys/${surveyId}/results`);
    return { success: true };
  } catch (error) {
    console.error('Delete session responses error:', error);
    return { success: false, error: 'Failed to delete session responses' };
  }
}

// Delete ALL responses for a survey
export async function deleteAllSurveyResponses(surveyId: string) {
  try {
    // Get all session IDs first
    const { data: responses } = await supabaseAdmin
      .from('responses')
      .select('session_id')
      .eq('survey_id', surveyId);

    const sessionIds = [...new Set((responses || []).map(r => r.session_id))];

    // Delete all responses
    const { error: responsesError } = await supabaseAdmin
      .from('responses')
      .delete()
      .eq('survey_id', surveyId);

    if (responsesError) throw responsesError;

    // Delete all media views for this survey
    await supabaseAdmin
      .from('media_views')
      .delete()
      .eq('survey_id', surveyId);

    // Delete all session tracking for this survey
    await supabaseAdmin
      .from('session_tracking')
      .delete()
      .eq('survey_id', surveyId);

    revalidatePath(`/[admin]/surveys/${surveyId}/responses`);
    revalidatePath(`/[admin]/surveys/${surveyId}/results`);
    return { 
      success: true,
      deletedCount: responses?.length || 0,
      deletedSessions: sessionIds.length
    };
  } catch (error) {
    console.error('Delete all survey responses error:', error);
    return { success: false, error: 'Failed to delete all responses' };
  }
}
