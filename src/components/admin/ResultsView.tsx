'use client';

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

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Card>
          <CardContent className="pt-4 sm:pt-6 px-2 sm:px-6">
            <div className="text-center">
              <p className="text-xl sm:text-3xl font-bold text-primary">
                {results.total_responses}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Responses
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6 px-2 sm:px-6">
            <div className="text-center">
              <p className="text-xl sm:text-3xl font-bold text-primary">
                {results.questions.length}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Questions
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6 px-2 sm:px-6">
            <div className="text-center">
              <p className="text-xl sm:text-3xl font-bold text-primary">
                {Object.keys(results.by_age).length}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Age Groups
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demographics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Responses by Age Range</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(results.by_age).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No data available
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(results.by_age).map(([age, count]) => (
                  <div key={age}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{age}</span>
                      <span className="text-sm text-muted-foreground">
                        {count} ({calculatePercentage(count, results.total_responses)}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{
                          width: `${calculatePercentage(count, results.total_responses)}%`,
                        }}
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
            <CardTitle>Responses by Gender</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(results.by_gender).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No data available
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(results.by_gender).map(([gender, count]) => (
                  <div key={gender}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium capitalize">
                        {gender.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {count} ({calculatePercentage(count, results.total_responses)}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{
                          width: `${calculatePercentage(count, results.total_responses)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Device & Browser Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">By Device Type</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(results.by_device || {}).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No data available
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(results.by_device || {}).map(([device, count]) => (
                  <div key={device}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium capitalize flex items-center gap-2">
                        {device === 'mobile' && '📱'}
                        {device === 'tablet' && '📲'}
                        {device === 'desktop' && '🖥️'}
                        {device}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {count} ({calculatePercentage(count, results.total_responses)}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${calculatePercentage(count, results.total_responses)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">By Browser</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(results.by_browser || {}).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No data available
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(results.by_browser || {}).map(([browser, count]) => (
                  <div key={browser}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        {browser}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {count} ({calculatePercentage(count, results.total_responses)}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${calculatePercentage(count, results.total_responses)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">By Operating System</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(results.by_os || {}).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No data available
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(results.by_os || {}).map(([os, count]) => (
                  <div key={os}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        {os}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {count} ({calculatePercentage(count, results.total_responses)}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${calculatePercentage(count, results.total_responses)}%`,
                        }}
                      />
                    </div>
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
          <CardTitle>Question Results</CardTitle>
        </CardHeader>
        <CardContent>
          {results.questions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No questions in this survey
            </p>
          ) : (
            <div className="space-y-6">
              {results.questions.map((question, index) => {
                const mediaUrl = getMediaUrl(question.question_id);
                const viewCount = getMediaViewCount(question.question_id);
                const questionHasMedia = hasMedia(question.question_id);

                return (
                  <div
                    key={question.question_id}
                    className="border border-border rounded-lg p-3 sm:p-4"
                  >
                    {/* Question Header */}
                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-4">
                      {/* Image Thumbnail */}
                      {mediaUrl && (
                        <img
                          src={mediaUrl}
                          alt="Question media"
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            Q{index + 1}
                          </span>
                          {questionHasMedia && (
                            viewCount > 0 ? (
                              <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
                                Image Viewed ({viewCount}x)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded">
                                Image Not Viewed
                              </span>
                            )
                          )}
                        </div>
                        <h4 className="font-medium text-foreground text-sm sm:text-base">
                          {question.question_text}
                        </h4>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex flex-wrap gap-3 sm:gap-4 mb-4 p-2 sm:p-3 bg-muted/50 rounded-lg">
                      <div className="text-center">
                        <p className="text-lg sm:text-xl font-bold text-primary">
                          {question.total_responses}
                        </p>
                        <p className="text-xs text-muted-foreground">Responses</p>
                      </div>
                      
                      {questionHasMedia && (
                        <div className="text-center border-l border-border pl-3 sm:pl-4">
                          <p className="text-lg sm:text-xl font-bold text-blue-600">
                            {viewCount}
                          </p>
                          <p className="text-xs text-muted-foreground">Image Views</p>
                        </div>
                      )}
                      
                      {questionHasMedia && question.total_responses > 0 && (
                        <div className="text-center border-l border-border pl-3 sm:pl-4">
                          <p className="text-lg sm:text-xl font-bold text-purple-600">
                            {calculatePercentage(viewCount, question.total_responses)}%
                          </p>
                          <p className="text-xs text-muted-foreground">View Rate</p>
                        </div>
                      )}
                    </div>

                    {/* Results */}
                    {question.question_type === 'like_dislike' ? (
                      <div className="grid grid-cols-2 gap-2 sm:gap-4">
                        <div className="text-center p-2 sm:p-4 bg-green-50 rounded-lg">
                          <p className="text-xl sm:text-2xl font-bold text-green-600">
                            {question.like_count || 0}
                          </p>
                          <p className="text-xs sm:text-sm text-green-700 mt-1">
                            Like ({calculatePercentage(question.like_count || 0, question.total_responses)}%)
                          </p>
                        </div>
                        <div className="text-center p-2 sm:p-4 bg-red-50 rounded-lg">
                          <p className="text-xl sm:text-2xl font-bold text-red-600">
                            {question.dislike_count || 0}
                          </p>
                          <p className="text-xs sm:text-sm text-red-700 mt-1">
                            Dislike ({calculatePercentage(question.dislike_count || 0, question.total_responses)}%)
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Average Rating:</span>
                          <span className="text-lg font-bold text-primary">
                            {question.average_rating?.toFixed(2) || '0.00'} / 5
                          </span>
                        </div>
                        {[1, 2, 3, 4, 5].map((rating) => {
                          const count = question[`rating_${rating}` as keyof typeof question] as number || 0;
                          return (
                            <div key={rating}>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">{rating} ★</span>
                                <span className="text-sm text-muted-foreground">
                                  {count} ({calculatePercentage(count, question.total_responses)}%)
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all"
                                  style={{
                                    width: `${calculatePercentage(count, question.total_responses)}%`,
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
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
