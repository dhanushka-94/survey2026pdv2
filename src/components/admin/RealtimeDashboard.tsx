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
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [countdown, setCountdown] = useState(10);

  // Fetch active sessions
  const fetchSessions = async () => {
    if (!selectedSurveyId) return;

    const result = await getActiveSessions(selectedSurveyId);
    if (result.success && result.data) {
      setStats(result.data);
      setLastUpdate(new Date());
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
          setCountdown(10);
        }
      )
      .subscribe();

    // Refresh every 10 seconds
    const interval = setInterval(() => {
      fetchSessions();
      setCountdown(10);
    }, 10000);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 10));
    }, 1000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, [selectedSurveyId]);

  const surveyOptions = surveys.map((survey) => ({
    value: survey.id,
    label: survey.title,
  }));

  const selectedSurvey = surveys.find(s => s.id === selectedSurveyId);

  if (surveys.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-muted-foreground text-lg">
        No surveys available. Create a survey first.
      </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Survey Selector and Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl border border-blue-200">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="animate-pulse">🔴</span> Live Tracking
          </h2>
          <p className="text-sm text-muted-foreground">
            Real-time monitoring of active survey participants
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-muted-foreground">Next refresh in</p>
            <p className="text-2xl font-bold text-blue-600">{countdown}s</p>
          </div>
          <div className="px-3 py-2 bg-green-100 rounded-full border border-green-300 flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-700">LIVE</span>
          </div>
        </div>
      </div>

      {/* Survey Selector */}
      <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
      <Select
          label="📋 Select Survey"
        options={surveyOptions}
        value={selectedSurveyId}
          onChange={(e) => {
            setSelectedSurveyId(e.target.value);
            setIsLoading(true);
          }}
      />
        {selectedSurvey && (
          <p className="text-xs text-muted-foreground mt-2">
            Monitoring: <span className="font-semibold">{selectedSurvey.title}</span>
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="py-12">
          <LoadingSpinner className="mb-4" />
          <p className="text-center text-muted-foreground">Loading live data...</p>
        </div>
      ) : stats ? (
        <>
          {/* Stats Overview - Enhanced */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative overflow-hidden p-6 border-2 border-primary/20 rounded-2xl bg-gradient-to-br from-primary/5 via-pink-50/50 to-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12"></div>
              <div className="relative">
                <div className="text-5xl font-extrabold text-primary mb-2 flex items-center gap-3">
                {stats.total_active_users}
                  {stats.total_active_users > 0 && (
                    <span className="text-2xl animate-bounce">👥</span>
                  )}
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Users
                </p>
                <p className="text-xs text-primary/70 mt-1">
                  Last 2 minutes
              </p>
              </div>
            </div>

            <div className="relative overflow-hidden p-6 border-2 border-blue-200 rounded-2xl bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/30 rounded-full -mr-12 -mt-12"></div>
              <div className="relative">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">
                {stats.active_sessions.length}
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                Total Sessions
              </p>
                <p className="text-xs text-blue-600/70 mt-1">
                  Currently tracked
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden p-6 border-2 border-purple-200 rounded-2xl bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100/30 rounded-full -mr-12 -mt-12"></div>
              <div className="relative">
                <div className="text-4xl font-extrabold text-purple-600 mb-2 flex items-center gap-2">
                {formatTimeSpent(Math.round(stats.average_time_per_question))}
                  <span className="text-2xl">⏱️</span>
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg. Time
              </p>
                <p className="text-xs text-purple-600/70 mt-1">
                  Per question
              </p>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          {stats.active_sessions.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="text-sm font-semibold text-green-700">
                  {stats.active_sessions.length} {stats.active_sessions.length === 1 ? 'person is' : 'people are'} currently taking this survey
                </h3>
              </div>
              <div className="flex gap-2 flex-wrap">
                {stats.active_sessions.slice(0, 10).map((session, idx) => (
                  <div
                    key={session.session_id}
                    className="w-10 h-10 bg-white border-2 border-green-400 rounded-full flex items-center justify-center text-xs font-bold text-green-600 shadow-sm hover:scale-110 transition-transform"
                    title={`Session ${session.session_id.substring(0, 8)} - Page ${session.current_page}`}
                  >
                    {session.current_page}
                  </div>
                ))}
                {stats.active_sessions.length > 10 && (
                  <div className="w-10 h-10 bg-green-100 border-2 border-green-300 rounded-full flex items-center justify-center text-xs font-bold text-green-700">
                    +{stats.active_sessions.length - 10}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Active Sessions List - Enhanced */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <span>👤</span> Active Sessions
              </h3>
              <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            </div>

            {stats.active_sessions.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl bg-muted/20">
                <div className="text-6xl mb-4 opacity-30">😴</div>
                <p className="text-muted-foreground text-lg font-medium">
                No active users at the moment
              </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Users will appear here when they start taking the survey
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.active_sessions.map((session, index) => {
                  const secondsSinceActive = Math.floor((Date.now() - new Date(session.last_active_at).getTime()) / 1000);
                  const isVeryRecent = secondsSinceActive < 10;
                  
                  return (
                  <div
                    key={session.session_id}
                      className={`relative p-5 border-2 rounded-xl transition-all duration-300 hover:shadow-lg ${
                        isVeryRecent 
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-md' 
                          : 'bg-white border-border hover:border-primary/30'
                      }`}
                    >
                      {/* User Badge */}
                      <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-primary to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-4 border-white">
                        {index + 1}
                      </div>

                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 ml-5">
                        {/* Session Info */}
                        <div className="flex-1 space-y-3">
                          {/* Status and ID */}
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                              isVeryRecent ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                            }`}>
                              <div className={`w-2 h-2 rounded-full ${isVeryRecent ? 'bg-white animate-pulse' : 'bg-gray-400'}`} />
                              <span className="text-xs font-bold">
                                {isVeryRecent ? 'ACTIVE NOW' : 'ACTIVE'}
                              </span>
                            </div>
                            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                              ID: {session.session_id.substring(0, 12)}...
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {secondsSinceActive}s ago
                            </span>
                            {session.latitude != null && session.longitude != null && (
                              <a
                                href={`https://www.google.com/maps?q=${session.latitude},${session.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                              >
                                📍 Map
                              </a>
                            )}
                        </div>

                          {/* Progress Info */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-foreground">
                                📄 Page {session.current_page}
                              </span>
                        {session.question_text && (
                                <span className="text-xs text-muted-foreground">
                                  • Current question
                                </span>
                              )}
                            </div>
                            
                            {session.question_text && (
                              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-xs text-blue-600 font-medium mb-1">
                                  Currently viewing:
                                </p>
                                <p className="text-sm text-foreground font-medium line-clamp-2">
                            {session.question_text}
                          </p>
                              </div>
                        )}
                          </div>
                        </div>

                        {/* Stats Panel */}
                        <div className="flex lg:flex-col gap-4 lg:gap-2 lg:text-right">
                          <div className="flex-1 lg:flex-none">
                            <p className="text-xs text-muted-foreground">Time Spent</p>
                            <p className="text-2xl font-bold text-purple-600">
                              {formatTimeSpent(session.time_spent_seconds)}
                            </p>
                          </div>
                          <div className="flex-1 lg:flex-none">
                            <p className="text-xs text-muted-foreground">Last Active</p>
                            <p className="text-sm font-semibold text-muted-foreground">
                              {new Date(session.last_active_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                          <span>Survey Progress</span>
                          <span className="font-semibold">{session.current_page > 0 ? 'In Progress' : 'Starting'}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
                            style={{ width: session.current_page > 0 ? '50%' : '10%' }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="text-center text-xs text-muted-foreground bg-muted/50 p-4 rounded-lg border border-border">
            <p>
              🔄 Auto-refreshing every 10 seconds • Real-time updates via Supabase
            </p>
            <p className="mt-1">
              Sessions shown: Active within last 2 minutes
            </p>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-muted-foreground text-lg">
          No data available
        </p>
        </div>
      )}
    </div>
  );
}
