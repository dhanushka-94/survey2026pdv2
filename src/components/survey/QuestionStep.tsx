'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { updateSessionTracking } from '@/actions/tracking';
import { getDeviceInfo } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LikeDislikeInput } from './LikeDislikeInput';
import { RatingInput } from './RatingInput';
import { CombinedInput } from './CombinedInput';
import { BlurredMedia } from './BlurredMedia';
import { MultipleImages } from './MultipleImages';
import type { Question, DemographicsData } from '@/lib/types';

interface QuestionStepProps {
  question: Question;
  sessionId: string;
  surveyId: string;
  demographics: DemographicsData;
  onAnswer: (questionId: string, answerValue: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionStep({
  question,
  sessionId,
  surveyId,
  demographics,
  onAnswer,
  questionNumber,
  totalQuestions,
}: QuestionStepProps) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  // Reset selected value and start time when question changes
  useEffect(() => {
    setSelectedValue(null);
    setStartTime(Date.now());
  }, [question.id]);

  useEffect(() => {
    // Track question view
    updateSessionTracking({
      survey_id: surveyId,
      session_id: sessionId,
      current_page: questionNumber,
      question_id: question.id,
    });
  }, [question.id, sessionId, surveyId, questionNumber]);

  const handleSubmit = async () => {
    if (!selectedValue) return;
    
    setIsSubmitting(true);
    
    // Calculate time spent on this question
    const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);
    
    // Get device info
    const deviceInfo = getDeviceInfo();
    
    // Save response to database
    const { error } = await supabase.from('responses').insert([
      {
        survey_id: surveyId,
        question_id: question.id,
        session_id: sessionId,
        age_range: demographics.age_range,
        gender: demographics.gender,
        answer_value: selectedValue,
        device_type: deviceInfo.device_type,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        time_spent_seconds: timeSpentSeconds,
      },
    ]);

    if (error) {
      console.error('Error saving response:', error);
      alert('Failed to save your response. Please try again.');
      setIsSubmitting(false);
      return;
    }

    // Move to next question
    onAnswer(question.id, selectedValue);
    setIsSubmitting(false);
  };

  const isLastQuestion = questionNumber === totalQuestions;

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 shadow-lg">
        <CardContent className="pt-6">
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-2">
              <h2 className="text-lg sm:text-xl font-bold text-foreground flex-1">
                {question.question_text}
              </h2>
              <span className="text-xs font-medium text-primary bg-primary-light px-2 py-1 rounded w-fit">
                Required *
              </span>
            </div>
            {question.description && (
              <p className="text-sm text-muted-foreground mt-2">
                {question.description}
              </p>
            )}
          </div>

          {/* Multiple Images */}
          {question.media_urls && Array.isArray(question.media_urls) && question.media_urls.length > 0 && (
            <div className="mb-4">
              <MultipleImages
                urls={question.media_urls}
                alt="Question media"
                surveyId={surveyId}
                questionId={question.id}
                sessionId={sessionId}
              />
            </div>
          )}

          {/* Single Image (legacy) */}
          {question.media_url && !question.media_urls && (
            <div className="mb-4">
              <BlurredMedia
                src={question.media_url}
                alt="Question media"
                type={question.media_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? 'image' : 'video'}
                surveyId={surveyId}
                questionId={question.id}
                sessionId={sessionId}
              />
            </div>
          )}

          <div className="mt-6">
            {question.question_type === 'like_dislike' ? (
              <LikeDislikeInput value={selectedValue} onChange={setSelectedValue} />
            ) : question.question_type === 'rating_1_5' ? (
              <RatingInput value={selectedValue} onChange={setSelectedValue} />
            ) : question.question_type === 'combined' ? (
              <CombinedInput value={selectedValue} onChange={setSelectedValue} />
            ) : (
              <LikeDislikeInput value={selectedValue} onChange={setSelectedValue} />
            )}
          </div>

          {/* Next Button */}
          <div className="mt-6 pt-4 border-t border-border">
            <Button
              onClick={handleSubmit}
              disabled={!selectedValue || isSubmitting}
              size="lg"
              className="w-full"
            >
              {isSubmitting ? (
                'Saving...'
              ) : isLastQuestion ? (
                'Submit Survey'
              ) : (
                <>Next Question →</>
              )}
            </Button>
            {!selectedValue && (
              <p className="text-xs text-center text-muted-foreground mt-2">
                Please select an option above to continue
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
