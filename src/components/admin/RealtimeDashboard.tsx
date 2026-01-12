'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { getActiveSessions } from '@/actions/tracking';
import { Select } from '@/components/ui/Select';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatTimeSpent, formatDateTime } from '@/lib/utils';
import type { Survey, RealtimeStats } from '@/lib/types';

interface RealtimeDashboardProps {
  surveys: Survey[];
}

export function RealtimeDashboard({ surveys }: RealtimeDashboardProps) {
  const [selectedSurveyId, setSelectedSurveyId] = useState(surveys[0]?.id || '');
  const [stats, setStats] = useState<RealtimeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch active sessions
  const fetchSessions = async () => {
    if (!selectedSurveyId) return;

    const result = await getActiveSessions(selectedSurveyId);
    if (result.success && result.data) {
      setStats(result.data);
    }
    setIsLoading(false);
  };

  // Initial fetch
  useEffect(() => {
    fetchSessions();
  }, [selectedSurveyId]);

  // Setup realtime subscription
  useEffect(() => {
    if (!selectedSurveyId) return;

    const channel = supabase
      .channel(`session_tracking:${selectedSurveyId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_tracking',
          filter: `survey_id=eq.${selectedSurveyId}`,
        },
        () => {
          // Refetch data when session tracking changes
          fetchSessions();
        }
      )
      .subscribe();

    // Refresh every 10 seconds
    const interval = setInterval(fetchSessions, 10000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [selectedSurveyId]);

  const surveyOptions = surveys.map((survey) => ({
    value: survey.id,
    label: survey.title,
  }));

  if (surveys.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        No surveys available. Create a survey first.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <Select
        label="Select Survey"
        options={surveyOptions}
        value={selectedSurveyId}
        onChange={(e) => setSelectedSurveyId(e.target.value)}
      />

      {isLoading ? (
        <LoadingSpinner className="py-12" />
      ) : stats ? (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 border border-border rounded-lg bg-background">
              <p className="text-3xl font-bold text-primary">
                {stats.total_active_users}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Active Users (Last 2 min)
              </p>
            </div>

            <div className="p-6 border border-border rounded-lg bg-background">
              <p className="text-3xl font-bold text-primary">
                {stats.active_sessions.length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Total Sessions
              </p>
            </div>

            <div className="p-6 border border-border rounded-lg bg-background">
              <p className="text-3xl font-bold text-primary">
                {formatTimeSpent(Math.round(stats.average_time_per_question))}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Avg. Time Spent
              </p>
            </div>
          </div>

          {/* Active Sessions List */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Active Sessions</h3>
            {stats.active_sessions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No active users at the moment
              </p>
            ) : (
              <div className="space-y-3">
                {stats.active_sessions.map((session) => (
                  <div
                    key={session.session_id}
                    className="p-4 border border-border rounded-lg bg-background hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-sm font-mono text-muted-foreground">
                            Session: {session.session_id.substring(0, 16)}...
                          </span>
                        </div>
                        <p className="text-sm">
                          <span className="font-medium">Page:</span> {session.current_page}
                        </p>
                        {session.question_text && (
                          <p className="text-sm mt-1">
                            <span className="font-medium">Current Question:</span>{' '}
                            {session.question_text}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-muted-foreground">
                          Time: {formatTimeSpent(session.time_spent_seconds)}
                        </p>
                        <p className="text-muted-foreground text-xs mt-1">
                          Last active: {formatDateTime(session.last_active_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="text-muted-foreground text-center py-8">
          No data available
        </p>
      )}
    </div>
  );
}
