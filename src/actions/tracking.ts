'use server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import type { SessionTracking, RealtimeStats } from '@/lib/types';

export async function updateSessionTracking(data: {
  survey_id: string;
  session_id: string;
  current_page: number;
  question_id?: string;
  latitude?: number;
  longitude?: number;
}) {
  try {
    // Check if session exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('session_tracking')
      .select('*')
      .eq('survey_id', data.survey_id)
      .eq('session_id', data.session_id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    const now = new Date().toISOString();

    if (existing) {
      // Calculate time spent on previous question/page
      const lastActive = new Date(existing.last_active_at);
      const timeSpentSeconds = Math.floor((Date.now() - lastActive.getTime()) / 1000);

      // Update existing session (include GPS if provided)
      const updatePayload: Record<string, unknown> = {
        current_page: data.current_page,
        question_id: data.question_id || null,
        time_spent_seconds: existing.time_spent_seconds + timeSpentSeconds,
        last_active_at: now,
      };
      if (data.latitude != null && data.longitude != null) {
        updatePayload.latitude = data.latitude;
        updatePayload.longitude = data.longitude;
      }
      const { error: updateError } = await supabaseAdmin
        .from('session_tracking')
        .update(updatePayload)
        .eq('id', existing.id);

      if (updateError) throw updateError;
    } else {
      // Insert new session (include GPS if provided)
      const insertPayload: Record<string, unknown> = {
        survey_id: data.survey_id,
        session_id: data.session_id,
        current_page: data.current_page,
        question_id: data.question_id || null,
        time_spent_seconds: 0,
        last_active_at: now,
      };
      if (data.latitude != null && data.longitude != null) {
        insertPayload.latitude = data.latitude;
        insertPayload.longitude = data.longitude;
      }
      const { error: insertError } = await supabaseAdmin
        .from('session_tracking')
        .insert([insertPayload]);

      if (insertError) throw insertError;
    }

    return { success: true };
  } catch (error) {
    console.error('Update session tracking error:', error);
    return { success: false, error: 'Failed to update session tracking' };
  }
}

export async function getActiveSessions(surveyId: string): Promise<{ success: boolean; data?: RealtimeStats; error?: string }> {
  try {
    // Get sessions active in last 2 minutes
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();

    const { data: sessions, error } = await supabaseAdmin
      .from('session_tracking')
      .select(`
        *,
        question:questions(question_text)
      `)
      .eq('survey_id', surveyId)
      .gte('last_active_at', twoMinutesAgo)
      .order('last_active_at', { ascending: false });

    if (error) throw error;

    // Calculate stats
    const activeSessions = (sessions || []).map((session: any) => ({
      session_id: session.session_id,
      current_page: session.current_page,
      question_id: session.question_id,
      question_text: session.question?.question_text,
      time_spent_seconds: session.time_spent_seconds,
      last_active_at: session.last_active_at,
      latitude: session.latitude ?? null,
      longitude: session.longitude ?? null,
    }));

    const totalTimeSpent = activeSessions.reduce(
      (sum, session) => sum + session.time_spent_seconds,
      0
    );

    const averageTime = activeSessions.length > 0
      ? totalTimeSpent / activeSessions.length
      : 0;

    return {
      success: true,
      data: {
        total_active_users: activeSessions.length,
        active_sessions: activeSessions,
        average_time_per_question: averageTime,
      },
    };
  } catch (error) {
    console.error('Get active sessions error:', error);
    return { success: false, error: 'Failed to fetch active sessions' };
  }
}

export interface GpsLocation {
  id: string;
  survey_id: string;
  survey_title: string;
  session_id: string;
  latitude: number;
  longitude: number;
  last_active_at: string;
  current_page: number;
}

export async function getGpsLocations(): Promise<{
  success: boolean;
  data?: GpsLocation[];
  error?: string;
}> {
  try {
    const { data: sessions, error } = await supabaseAdmin
      .from('session_tracking')
      .select(`
        id,
        survey_id,
        session_id,
        latitude,
        longitude,
        last_active_at,
        current_page,
        surveys(title)
      `)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .order('last_active_at', { ascending: false })
      .limit(500);

    if (error) throw error;

    const locations: GpsLocation[] = (sessions || []).map((s: any) => ({
      id: s.id,
      survey_id: s.survey_id,
      survey_title: s.surveys?.title || 'Unknown Survey',
      session_id: s.session_id,
      latitude: s.latitude,
      longitude: s.longitude,
      last_active_at: s.last_active_at,
      current_page: s.current_page,
    }));

    return { success: true, data: locations };
  } catch (error) {
    console.error('Get GPS locations error:', error);
    return { success: false, data: [], error: 'Failed to fetch GPS locations' };
  }
}

export async function cleanupOldSessions() {
  try {
    // Remove sessions older than 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { error } = await supabaseAdmin
      .from('session_tracking')
      .delete()
      .lt('last_active_at', oneHourAgo);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Cleanup old sessions error:', error);
    return { success: false, error: 'Failed to cleanup old sessions' };
  }
}

// Track when a user clicks to view media (image/gif)
export async function trackMediaView(data: {
  survey_id: string;
  question_id: string;
  session_id: string;
}) {
  try {
    const { error } = await supabaseAdmin
      .from('media_views')
      .insert([
        {
          survey_id: data.survey_id,
          question_id: data.question_id,
          session_id: data.session_id,
        },
      ]);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Track media view error:', error);
    return { success: false, error: 'Failed to track media view' };
  }
}

// Get media view stats for a survey
export async function getMediaViewStats(surveyId: string) {
  try {
    // First, get all questions with media for this survey
    const { data: questions, error: questionsError } = await supabaseAdmin
      .from('questions')
      .select('id, question_text, media_url')
      .eq('survey_id', surveyId)
      .not('media_url', 'is', null);

    if (questionsError) throw questionsError;

    // Then get all media views for this survey
    const { data: views, error: viewsError } = await supabaseAdmin
      .from('media_views')
      .select('question_id')
      .eq('survey_id', surveyId);

    if (viewsError) throw viewsError;

    // Count views per question
    const viewCounts: Record<string, number> = {};
    (views || []).forEach((view: any) => {
      viewCounts[view.question_id] = (viewCounts[view.question_id] || 0) + 1;
    });

    // Build stats for all questions with media
    const stats = (questions || [])
      .filter((q: any) => q.media_url) // Only questions with media
      .map((q: any) => ({
        question_id: q.id,
        question_text: q.question_text,
        media_url: q.media_url,
        view_count: viewCounts[q.id] || 0,
      }));

    return { 
      success: true, 
      data: stats
    };
  } catch (error) {
    console.error('Get media view stats error:', error);
    return { success: false, error: 'Failed to fetch media view stats' };
  }
}
