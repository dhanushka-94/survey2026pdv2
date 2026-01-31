'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatDateTime } from '@/lib/utils';
import { deleteSessionResponses, deleteResponse } from '@/actions/responses';
import type { IndividualResponse } from '@/actions/responses';

interface IndividualResponsesViewProps {
  responses: IndividualResponse[];
  surveyTitle: string;
  surveyId: string;
}

export function IndividualResponsesView({ responses, surveyTitle, surveyId }: IndividualResponsesViewProps) {
  const router = useRouter();
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDevice, setFilterDevice] = useState<string>('all');
  const [expandedImages, setExpandedImages] = useState<Set<string>>(new Set());
  const [deletingSession, setDeletingSession] = useState<string | null>(null);
  const [deletingResponse, setDeletingResponse] = useState<string | null>(null);

  const toggleImageExpand = (key: string) => {
    setExpandedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  // Get unique device types for filter
  const deviceTypes = ['all', ...new Set(responses.map(r => r.device_type))];

  // Filter responses
  const filteredResponses = responses.filter(response => {
    const matchesSearch = 
      response.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.browser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.os.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDevice = filterDevice === 'all' || response.device_type === filterDevice;
    
    return matchesSearch && matchesDevice;
  });

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getAnswerDisplay = (answer: string, type: string) => {
    // Handle combined type (JSON format)
    if (type === 'combined') {
      try {
        const parsed = JSON.parse(answer);
        return (
          <div className="flex flex-col gap-1">
            <span className={parsed.like === 'like' ? 'text-green-600' : 'text-red-600'}>
              {parsed.like === 'like' ? '👍 Like' : '👎 Dislike'}
            </span>
            <span className="text-primary font-medium flex items-center gap-1">
              <span className="text-lg">{'⭐'.repeat(parseInt(parsed.rating || '0'))}</span>
              <span className="text-sm text-muted-foreground">({parsed.rating}/5)</span>
            </span>
          </div>
        );
      } catch {
        return <span className="text-muted-foreground">Invalid answer</span>;
      }
    }

    if (type === 'like_dislike') {
      return answer === 'like' ? (
        <span className="text-green-600 font-medium flex items-center gap-1">
          <span className="text-lg">👍</span> Like
        </span>
      ) : (
        <span className="text-red-600 font-medium flex items-center gap-1">
          <span className="text-lg">👎</span> Dislike
        </span>
      );
    }
    // Rating
    return (
      <span className="text-primary font-medium flex items-center gap-1">
        <span className="text-lg">{'⭐'.repeat(parseInt(answer))}</span>
        <span className="text-sm text-muted-foreground">({answer}/5)</span>
      </span>
    );
  };

  // Calculate stats
  const totalResponses = responses.length;
  const avgTimePerSurvey = totalResponses > 0 
    ? Math.round(responses.reduce((acc, r) => acc + r.total_time_seconds, 0) / totalResponses)
    : 0;
  const mobileCount = responses.filter(r => r.device_type === 'mobile').length;
  const desktopCount = responses.filter(r => r.device_type === 'desktop').length;

  const handleDeleteSession = async (sessionId: string, displayName: string) => {
    if (!confirm(`Are you sure you want to delete all responses from "${displayName}"?\n\nThis will permanently delete:\n- All answers from this user\n- Media view tracking\n- Session tracking data\n\nThis action cannot be undone.`)) {
      return;
    }

    setDeletingSession(sessionId);
    try {
      const result = await deleteSessionResponses(sessionId, surveyId);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || 'Failed to delete responses');
      }
    } catch (error) {
      alert('An error occurred while deleting');
      console.error(error);
    } finally {
      setDeletingSession(null);
    }
  };

  const handleDeleteIndividualResponse = async (responseId: string, questionText: string) => {
    if (!confirm(`Are you sure you want to delete this answer?\n\nQuestion: "${questionText}"\n\nThis will permanently delete this single response.\n\nThis action cannot be undone.`)) {
      return;
    }

    setDeletingResponse(responseId);
    try {
      const result = await deleteResponse(responseId, surveyId);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || 'Failed to delete response');
      }
    } catch (error) {
      alert('An error occurred while deleting');
      console.error(error);
    } finally {
      setDeletingResponse(null);
    }
  };

  if (responses.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-muted-foreground text-lg">No responses yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Responses will appear here once users complete the survey
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="pt-4 pb-4 px-3 sm:px-6">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-primary">{totalResponses}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Total Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 px-3 sm:px-6">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{formatTime(avgTimePerSurvey)}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Avg. Time</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 px-3 sm:px-6">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-green-600">📱 {mobileCount}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Mobile</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 px-3 sm:px-6">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-purple-600">🖥️ {desktopCount}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Desktop</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search by device, browser, OS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              {deviceTypes.map(device => (
                <button
                  key={device}
                  onClick={() => setFilterDevice(device)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    filterDevice === device
                      ? 'bg-primary text-white'
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                >
                  {device === 'all' ? 'All' : device === 'mobile' ? '📱 Mobile' : device === 'tablet' ? '📲 Tablet' : '🖥️ Desktop'}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Responses List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            {filteredResponses.length} Response{filteredResponses.length !== 1 ? 's' : ''}
            {searchTerm || filterDevice !== 'all' ? ' (filtered)' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredResponses.map((response) => (
              <div
                key={response.session_id}
                className="border border-border rounded-lg overflow-hidden bg-white"
              >
                {/* Header - Always visible */}
                <div className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <button
                      onClick={() => setExpandedSession(
                        expandedSession === response.session_id ? null : response.session_id
                      )}
                      className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-muted/30 transition-colors text-left rounded p-2 -m-2"
                    >
                      {/* Left side - Device name and info */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                          {response.device_type === 'mobile' ? '📱' : response.device_type === 'tablet' ? '📲' : '🖥️'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground text-sm sm:text-base">
                            {response.display_name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                            <span>{response.os}</span>
                            <span>•</span>
                            <span className="capitalize">{response.gender.replace('_', ' ')}</span>
                            <span>•</span>
                            <span>{response.age_range}</span>
                            {response.latitude != null && response.longitude != null && (
                              <>
                                <span>•</span>
                                <a
                                  href={`https://www.google.com/maps?q=${response.latitude},${response.longitude}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline inline-flex items-center gap-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  📍 View on map
                                </a>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right side - Stats */}
                      <div className="flex items-center gap-3 sm:gap-4 ml-13 sm:ml-0">
                        <div className="text-center">
                          <p className="text-sm sm:text-base font-semibold text-blue-600">
                            {formatTime(response.total_time_seconds)}
                          </p>
                          <p className="text-xs text-muted-foreground">Time</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm sm:text-base font-semibold text-foreground">
                            {response.answers.length}
                          </p>
                          <p className="text-xs text-muted-foreground">Answers</p>
                        </div>
                        <div className="text-center hidden sm:block">
                          <p className="text-sm font-semibold text-green-600">
                            {response.answers.filter(a => a.has_media && a.media_viewed).length}/{response.answers.filter(a => a.has_media).length}
                          </p>
                          <p className="text-xs text-muted-foreground">Images</p>
                        </div>
                        <svg
                          className={`w-5 h-5 text-muted-foreground transition-transform ${
                            expandedSession === response.session_id ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {/* Delete Button */}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSession(response.session_id, response.display_name);
                      }}
                      disabled={deletingSession === response.session_id}
                      className="flex-shrink-0"
                    >
                      {deletingSession === response.session_id ? '⏳ Deleting...' : '🗑️ Delete'}
                    </Button>
                  </div>
                </div>

                {/* Expanded content - Detailed answers */}
                {expandedSession === response.session_id && (
                  <div className="border-t border-border bg-muted/20 p-3 sm:p-4">
                    {/* Meta info */}
                    <div className="flex flex-wrap gap-2 mb-4 text-xs">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        🕐 Total: {formatTime(response.total_time_seconds)}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                        📸 Images viewed: {response.answers.filter(a => a.has_media && a.media_viewed).length}/{response.answers.filter(a => a.has_media).length}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                        {response.browser} on {response.os}
                      </span>
                      {response.latitude != null && response.longitude != null && (
                        <a
                          href={`https://www.google.com/maps?q=${response.latitude},${response.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 bg-amber-100 text-amber-800 rounded hover:bg-amber-200 transition-colors inline-flex items-center gap-1"
                        >
                          📍 {response.latitude.toFixed(5)}, {response.longitude.toFixed(5)} → Map
                        </a>
                      )}
                    </div>

                    {/* Answers list */}
                    <h4 className="text-sm font-semibold mb-3 text-foreground">All Answers:</h4>
                    <div className="space-y-3">
                      {response.answers.map((answer, answerIndex) => {
                        const imageKey = `${response.session_id}-${answer.question_id}`;
                        const isImageExpanded = expandedImages.has(imageKey);
                        
                        return (
                        <div
                          key={answer.question_id}
                          className="p-3 bg-white rounded-lg border border-border"
                        >
                            <div className="flex flex-col gap-3">
                              {/* Question header row */}
                          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                            {/* Question info */}
                            <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                  Q{answerIndex + 1}
                                </span>
                                {answer.has_media && (
                                  answer.media_viewed ? (
                                        <button
                                          onClick={() => toggleImageExpand(imageKey)}
                                          className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded flex items-center gap-1 hover:bg-green-200 transition-colors cursor-pointer"
                                        >
                                          👁️ Viewed {isImageExpanded ? '(hide)' : '(show)'}
                                        </button>
                                  ) : (
                                    <span className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded flex items-center gap-1">
                                      🙈 Not viewed
                                    </span>
                                  )
                                )}
                                <span className="text-xs text-muted-foreground">
                                  ⏱️ {formatTime(answer.time_spent_seconds)}
                                </span>
                              </div>
                              <p className="text-sm text-foreground">
                                {answer.question_text}
                              </p>
                            </div>
                            
                            {/* Answer value */}
                            <div className="flex flex-col items-end gap-2">
                              <div className="flex-shrink-0">
                                {getAnswerDisplay(answer.answer_value, answer.question_type)}
                              </div>
                              {/* Delete Individual Answer Button */}
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteIndividualResponse(answer.response_id, answer.question_text);
                                }}
                                disabled={deletingResponse === answer.response_id}
                                className="text-xs"
                              >
                                {deletingResponse === answer.response_id ? '⏳' : '🗑️'}
                              </Button>
                            </div>
                              </div>

                              {/* Show image if viewed and expanded */}
                              {answer.has_media && answer.media_viewed && answer.media_url && isImageExpanded && (
                                <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                    <span>📸</span> Image viewed by this user:
                                  </p>
                                  <img
                                    src={answer.media_url}
                                    alt="Question media"
                                    className="max-w-full sm:max-w-md rounded-lg shadow-sm"
                                  />
                                </div>
                              )}

                              {/* Show image clearly for admin - even if user didn't view */}
                              {answer.has_media && !answer.media_viewed && answer.media_url && (
                                <div className="mt-2 p-3 bg-red-50 rounded-lg border-2 border-red-200">
                                  <p className="text-xs text-red-700 mb-2 flex items-center gap-1 font-semibold">
                                    <span>⚠️</span> User did NOT view this image (Admin View):
                                  </p>
                                  <img
                                    src={answer.media_url}
                                    alt="Question media (not viewed by user)"
                                    className="max-w-full sm:max-w-md rounded-lg shadow-md"
                                  />
                                  <p className="text-xs text-red-600 mt-2 italic">
                                    User skipped viewing this image before answering
                                  </p>
                                </div>
                              )}

                              {/* Multiple Images Support */}
                              {answer.media_urls && answer.media_urls.length > 0 && (
                                <div className="mt-2">
                                  {answer.media_viewed ? (
                                    <div className="p-2 bg-green-50 rounded-lg border border-green-200">
                                      <p className="text-xs text-green-700 mb-2 flex items-center gap-1 font-semibold">
                                        <span>👁️</span> User viewed images ({answer.media_urls.length} total):
                                      </p>
                                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {answer.media_urls.map((url: string, idx: number) => (
                                          <div key={idx} className="relative">
                                            <img
                                              src={url}
                                              alt={`Media ${idx + 1}`}
                                              className="w-full h-32 object-cover rounded-lg shadow-sm"
                                            />
                                            <div className="absolute top-1 left-1 w-6 h-6 bg-green-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                              {idx + 1}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="p-3 bg-red-50 rounded-lg border-2 border-red-200">
                                      <p className="text-xs text-red-700 mb-2 flex items-center gap-1 font-semibold">
                                        <span>⚠️</span> User did NOT view these images (Admin View - {answer.media_urls.length} images):
                                      </p>
                                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {answer.media_urls.map((url: string, idx: number) => (
                                          <div key={idx} className="relative">
                                            <img
                                              src={url}
                                              alt={`Media ${idx + 1} (not viewed)`}
                                              className="w-full h-32 object-cover rounded-lg shadow-md"
                                            />
                                            <div className="absolute top-1 left-1 w-6 h-6 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                              {idx + 1}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                      <p className="text-xs text-red-600 mt-2 italic">
                                        User skipped viewing these images before answering
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                          </div>
                        </div>
                        );
                      })}
                    </div>
                    
                    {/* Session footer */}
                    <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
                      <span>Submitted: {formatDateTime(response.submitted_at)}</span>
                      <span className="font-mono text-[10px] break-all">
                        Session: {response.session_id.substring(0, 24)}...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredResponses.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No responses match your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
