'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { calculatePercentage } from '@/lib/utils';
import type { AggregatedResults, QuestionType } from '@/lib/types';

interface MediaViewStat {
  question_id: string;
  question_text: string;
  media_url: string;
  view_count: number;
}

interface ResultsViewProps {
  results: AggregatedResults;
  mediaViews?: MediaViewStat[];
}

export function ResultsView({ results, mediaViews = [] }: ResultsViewProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  // Helper to get media view count for a question
  const getMediaViewCount = (questionId: string): number => {
    const found = mediaViews.find(mv => mv.question_id === questionId);
    return found?.view_count || 0;
  };

  // Helper to get media URL for a question
  const getMediaUrl = (questionId: string): string | null => {
    const found = mediaViews.find(mv => mv.question_id === questionId);
    return found?.media_url || null;
  };

  // Check if question has media
  const hasMedia = (questionId: string): boolean => {
    return mediaViews.some(mv => mv.question_id === questionId && mv.media_url);
  };

  // Calculate overall stats
  const totalLikes = results.questions.reduce((acc, q) => acc + (q.like_count || 0), 0);
  const totalDislikes = results.questions.reduce((acc, q) => acc + (q.dislike_count || 0), 0);
  const totalImageViews = mediaViews.reduce((acc, mv) => acc + mv.view_count, 0);
  const questionsWithMedia = mediaViews.filter(mv => mv.media_url).length;
  
  // Calculate average rating across all rating questions
  const ratingQuestions = results.questions.filter(q => q.question_type === 'rating_1_5');
  const overallAvgRating = ratingQuestions.length > 0
    ? ratingQuestions.reduce((acc, q) => acc + (q.average_rating || 0), 0) / ratingQuestions.length
    : 0;

  // Get top liked questions
  const likeDislikeQuestions = results.questions.filter(q => q.question_type === 'like_dislike');
  const sortedByLikes = [...likeDislikeQuestions].sort((a, b) => 
    ((b.like_count || 0) / (b.total_responses || 1)) - ((a.like_count || 0) / (a.total_responses || 1))
  );

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="bg-gradient-to-r from-primary/10 via-pink-50 to-red-50 rounded-2xl p-6 border border-primary/20">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <span>📊</span> Survey Overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-border">
            <p className="text-3xl font-bold text-primary">{results.total_responses}</p>
            <p className="text-sm text-muted-foreground mt-1">Total Responses</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-border">
            <p className="text-3xl font-bold text-blue-600">{results.questions.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Questions</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-border">
            <p className="text-3xl font-bold text-green-600">
              {totalLikes + totalDislikes > 0 ? Math.round((totalLikes / (totalLikes + totalDislikes)) * 100) : 0}%
            </p>
            <p className="text-sm text-muted-foreground mt-1">Like Rate</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-border">
            <p className="text-3xl font-bold text-purple-600">
              {questionsWithMedia > 0 ? Math.round((totalImageViews / (results.total_responses * questionsWithMedia)) * 100) : 0}%
            </p>
            <p className="text-sm text-muted-foreground mt-1">Image View Rate</p>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      {results.total_responses > 0 && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <span>💡</span> Quick Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Top performing question */}
              {sortedByLikes.length > 0 && sortedByLikes[0].total_responses > 0 && (
                <div className="p-3 bg-white rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-600 font-medium mb-1">🏆 Most Liked</p>
                  <p className="text-sm font-medium text-foreground line-clamp-2">
                    {sortedByLikes[0].question_text}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {calculatePercentage(sortedByLikes[0].like_count || 0, sortedByLikes[0].total_responses)}% liked
              </p>
            </div>
              )}
              
              {/* Average rating insight */}
              {ratingQuestions.length > 0 && (
                <div className="p-3 bg-white rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-600 font-medium mb-1">⭐ Avg Rating</p>
                  <p className="text-2xl font-bold text-primary">
                    {overallAvgRating.toFixed(1)} / 5
              </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Across {ratingQuestions.length} questions
              </p>
            </div>
              )}

              {/* Device breakdown */}
              {Object.keys(results.by_device || {}).length > 0 && (
                <div className="p-3 bg-white rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-600 font-medium mb-1">📱 Top Device</p>
                  <p className="text-sm font-medium text-foreground capitalize">
                    {Object.entries(results.by_device || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
              </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Object.entries(results.by_device || {}).sort((a, b) => b[1] - a[1])[0]?.[1] || 0} users
              </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Demographics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>👥</span> By Age Range
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(results.by_age).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No data available</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(results.by_age)
                  .sort((a, b) => b[1] - a[1])
                  .map(([age, count]) => (
                  <div key={age}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{age}</span>
                      <span className="text-sm text-muted-foreground">
                        {count} ({calculatePercentage(count, results.total_responses)}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-primary to-pink-500 h-3 rounded-full transition-all"
                        style={{ width: `${calculatePercentage(count, results.total_responses)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🚻</span> By Gender
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(results.by_gender).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No data available</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(results.by_gender)
                  .sort((a, b) => b[1] - a[1])
                  .map(([gender, count]) => {
                  const genderEmoji = gender === 'male' ? '👨' : gender === 'female' ? '👩' : '🧑';
                  return (
                  <div key={gender}>
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium capitalize flex items-center gap-1">
                          {genderEmoji} {gender.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {count} ({calculatePercentage(count, results.total_responses)}%)
                      </span>
                    </div>
                      <div className="w-full bg-muted rounded-full h-3">
                      <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                          style={{ width: `${calculatePercentage(count, results.total_responses)}%` }}
                      />
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Device & Browser Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <span>📱</span> By Device
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(results.by_device || {}).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No data</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(results.by_device || {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([device, count]) => (
                  <div key={device} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium capitalize flex items-center gap-2">
                      {device === 'mobile' ? '📱' : device === 'tablet' ? '📲' : '🖥️'}
                        {device}
                      </span>
                    <span className="text-sm font-bold text-blue-600">
                        {count} ({calculatePercentage(count, results.total_responses)}%)
                      </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <span>🌐</span> By Browser
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(results.by_browser || {}).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No data</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(results.by_browser || {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([browser, count]) => (
                  <div key={browser} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">{browser}</span>
                    <span className="text-sm font-bold text-green-600">
                        {count} ({calculatePercentage(count, results.total_responses)}%)
                      </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <span>💻</span> By OS
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(results.by_os || {}).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No data</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(results.by_os || {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([os, count]) => (
                  <div key={os} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">{os}</span>
                    <span className="text-sm font-bold text-purple-600">
                        {count} ({calculatePercentage(count, results.total_responses)}%)
                      </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Question Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📋</span> Question Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          {results.questions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No questions in this survey</p>
          ) : (
            <div className="space-y-4">
              {results.questions.map((question, index) => {
                const mediaUrl = getMediaUrl(question.question_id);
                const viewCount = getMediaViewCount(question.question_id);
                const questionHasMedia = hasMedia(question.question_id);
                const isExpanded = expandedQuestion === question.question_id;
                const likePercentage = question.total_responses > 0 
                  ? calculatePercentage(question.like_count || 0, question.total_responses) 
                  : 0;

                return (
                  <div
                    key={question.question_id}
                    className="border border-border rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow"
                  >
                    {/* Question Header - Clickable */}
                    <button
                      onClick={() => setExpandedQuestion(isExpanded ? null : question.question_id)}
                      className="w-full p-4 text-left hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                      {/* Image Thumbnail */}
                      {mediaUrl && (
                        <img
                          src={mediaUrl}
                          alt="Question media"
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      
                      <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="px-2 py-1 text-xs font-bold bg-primary/10 text-primary rounded">
                            Q{index + 1}
                          </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              question.question_type === 'like_dislike' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {question.question_type === 'like_dislike' ? '👍👎 Like/Dislike' : '⭐ Rating'}
                            </span>
                          {questionHasMedia && (
                              <span className={`px-2 py-1 text-xs font-medium rounded ${
                                viewCount > 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                📸 {viewCount}/{question.total_responses} viewed
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold text-foreground">{question.question_text}</h4>
                          
                          {/* Quick Result Preview */}
                          <div className="mt-3 flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                              {question.total_responses} responses
                            </span>
                            {question.question_type === 'like_dislike' && (
                              <div className="flex-1 max-w-xs">
                                <div className="flex h-2 rounded-full overflow-hidden bg-red-100">
                                  <div 
                                    className="bg-green-500 transition-all"
                                    style={{ width: `${likePercentage}%` }}
                                  />
                                </div>
                                <div className="flex justify-between text-xs mt-1">
                                  <span className="text-green-600">👍 {likePercentage}%</span>
                                  <span className="text-red-600">👎 {100 - likePercentage}%</span>
                                </div>
                              </div>
                            )}
                            {question.question_type === 'rating_1_5' && (
                              <span className="text-lg font-bold text-primary">
                                {question.average_rating?.toFixed(1) || '0.0'} ⭐
                              </span>
                          )}
                          </div>
                        </div>

                        <svg
                          className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-border p-4 bg-muted/20">
                    {/* Stats Row */}
                        <div className="flex flex-wrap gap-4 mb-4 p-3 bg-white rounded-lg border border-border">
                      <div className="text-center">
                            <p className="text-2xl font-bold text-primary">{question.total_responses}</p>
                        <p className="text-xs text-muted-foreground">Responses</p>
                      </div>
                      {questionHasMedia && (
                            <>
                              <div className="text-center border-l border-border pl-4">
                                <p className="text-2xl font-bold text-blue-600">{viewCount}</p>
                          <p className="text-xs text-muted-foreground">Image Views</p>
                        </div>
                              <div className="text-center border-l border-border pl-4">
                                <p className="text-2xl font-bold text-purple-600">
                                  {question.total_responses > 0 ? calculatePercentage(viewCount, question.total_responses) : 0}%
                          </p>
                          <p className="text-xs text-muted-foreground">View Rate</p>
                        </div>
                            </>
                      )}
                    </div>

                    {/* Results */}
                    {question.question_type === 'like_dislike' ? (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                              <div className="text-4xl mb-2">👍</div>
                              <p className="text-3xl font-bold text-green-600">{question.like_count || 0}</p>
                              <p className="text-sm text-green-700 mt-1">
                                {calculatePercentage(question.like_count || 0, question.total_responses)}% Like
                          </p>
                        </div>
                            <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                              <div className="text-4xl mb-2">👎</div>
                              <p className="text-3xl font-bold text-red-600">{question.dislike_count || 0}</p>
                              <p className="text-sm text-red-700 mt-1">
                                {calculatePercentage(question.dislike_count || 0, question.total_responses)}% Dislike
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-border">
                              <span className="text-sm font-medium">Average Rating</span>
                              <span className="text-2xl font-bold text-primary">
                                {question.average_rating?.toFixed(2) || '0.00'} / 5 ⭐
                          </span>
                        </div>
                            {[5, 4, 3, 2, 1].map((rating) => {
                          const count = question[`rating_${rating}` as keyof typeof question] as number || 0;
                              const percentage = calculatePercentage(count, question.total_responses);
                          return (
                                <div key={rating} className="flex items-center gap-3">
                                  <span className="w-16 text-sm font-medium">{'⭐'.repeat(rating)}</span>
                                  <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                                <div
                                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-4 transition-all"
                                      style={{ width: `${percentage}%` }}
                                />
                              </div>
                                  <span className="w-20 text-sm text-right text-muted-foreground">
                                    {count} ({percentage}%)
                                  </span>
                            </div>
                          );
                        })}
                          </div>
                        )}

                        {/* Show image if has media */}
                        {mediaUrl && (
                          <div className="mt-4 p-3 bg-white rounded-lg border border-border">
                            <p className="text-xs text-muted-foreground mb-2 font-medium">📸 Question Image:</p>
                            <img
                              src={mediaUrl}
                              alt="Question media"
                              className="max-w-full sm:max-w-md rounded-lg shadow-sm"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
