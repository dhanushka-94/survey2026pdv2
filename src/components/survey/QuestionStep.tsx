'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { updateSessionTracking } from '@/actions/tracking';
import { trackVideoView } from '@/actions/tracking';
import { canDeviceSubmitSurvey } from '@/actions/responses';
import { getDeviceInfo, getOrCreateDeviceId } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LikeDislikeInput } from './LikeDislikeInput';
import { RatingInput } from './RatingInput';
import { CombinedInput } from './CombinedInput';
import { MultiCheckboxInput } from './MultiCheckboxInput';
import { AllThreeInput } from './AllThreeInput';
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
  latitude?: number;
  longitude?: number;
}

export function QuestionStep({
  question,
  sessionId,
  surveyId,
  demographics,
  onAnswer,
  questionNumber,
  totalQuestions,
  latitude,
  longitude,
}: QuestionStepProps) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [showVideo, setShowVideo] = useState(false);
  const videoOpenedAtRef = useRef<number | null>(null);

  // Reset selected value and start time when question changes
  useEffect(() => {
    setSelectedValue(null);
    setStartTime(Date.now());
    setShowVideo(false);
    videoOpenedAtRef.current = null;
  }, [question.id]);

  useEffect(() => {
    if (!showVideo) return;
    videoOpenedAtRef.current = Date.now();
  }, [showVideo]);

  useEffect(() => {
    return () => {
      const openedAt = videoOpenedAtRef.current;
      if (!openedAt) return;
      const durationSeconds = Math.max(0, Math.round((Date.now() - openedAt) / 1000));
      void trackVideoView({
        survey_id: surveyId,
        question_id: question.id,
        session_id: sessionId,
        duration_seconds: durationSeconds,
      });
      videoOpenedAtRef.current = null;
    };
  }, [question.id, sessionId, surveyId]);

  const closeVideoAndTrack = async () => {
    if (!showVideo) return;

    const openedAt = videoOpenedAtRef.current;
    const durationSeconds = openedAt
      ? Math.max(0, Math.round((Date.now() - openedAt) / 1000))
      : 0;

    setShowVideo(false);
    videoOpenedAtRef.current = null;

    await trackVideoView({
      survey_id: surveyId,
      question_id: question.id,
      session_id: sessionId,
      duration_seconds: durationSeconds,
    });
  };

  const toEmbedUrl = (url: string): string => {
    const iframeSrcMatch = url.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
    const input = iframeSrcMatch?.[1] || url;

    try {
      const u = new URL(input);
      const host = u.hostname.toLowerCase();

      if (host.includes('youtube.com')) {
        if (u.pathname.startsWith('/embed/')) return input;
        const videoId = u.searchParams.get('v');
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      }
      if (host.includes('youtu.be')) {
        const videoId = u.pathname.replace('/', '');
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      }
      if (host.includes('vimeo.com')) {
        const id = u.pathname.split('/').filter(Boolean)[0];
        if (id) return `https://player.vimeo.com/video/${id}`;
      }
    } catch {
      // Keep original URL fallback
    }
    return input;
  };

  useEffect(() => {
    // Track question view (include GPS if available)
    updateSessionTracking({
      survey_id: surveyId,
      session_id: sessionId,
      current_page: questionNumber,
      question_id: question.id,
      ...(latitude != null && longitude != null ? { latitude, longitude } : {}),
    });
  }, [question.id, sessionId, surveyId, questionNumber, latitude, longitude]);

  const handleSubmit = async () => {
    if (!selectedValue) return;
    
    setIsSubmitting(true);
    
    // Calculate time spent on this question
    const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);
    
    // Get device info
    const deviceInfo = getDeviceInfo();
    const deviceId = getOrCreateDeviceId();

    const permission = await canDeviceSubmitSurvey(surveyId, deviceId, sessionId);
    if (!permission.success) {
      alert('Could not verify device submission rules. Please try again.');
      setIsSubmitting(false);
      return;
    }

    if (!permission.allowed) {
      alert('This survey allows up to 3 submissions per device. You have reached the limit.');
      setIsSubmitting(false);
      return;
    }
    
    // Save response to database
    const { error } = await supabase.from('responses').insert([
      {
        survey_id: surveyId,
        question_id: question.id,
        session_id: sessionId,
        age_range: demographics.age_range,
        gender: demographics.gender,
        answer_value: selectedValue,
        device_id: deviceId,
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

          {/* Question Video Link */}
          {question.video_url && (
            <div className="mb-5 rounded-xl border-2 border-rose-200 bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xl animate-pulse">
                    🎬
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-rose-800">
                      Video sample available
                    </p>
                    <p className="text-xs text-rose-700/80 mt-0.5">
                      Watch before answering this question.
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={() => setShowVideo(true)}
                  className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-semibold"
                >
                  ▶ Play Video
                </Button>
              </div>
            </div>
          )}

          <div className="mt-6">
            {question.question_type === 'like_dislike' ? (
              <LikeDislikeInput value={selectedValue} onChange={setSelectedValue} />
            ) : question.question_type === 'rating_1_5' ? (
              <RatingInput value={selectedValue} onChange={setSelectedValue} />
            ) : question.question_type === 'combined' ? (
              <CombinedInput value={selectedValue} onChange={setSelectedValue} />
            ) : question.question_type === 'multi_checkbox' ? (
              <MultiCheckboxInput
                value={selectedValue}
                options={question.checkbox_options || []}
                onChange={setSelectedValue}
              />
            ) : question.question_type === 'all_three' ? (
              <AllThreeInput
                value={selectedValue}
                options={question.checkbox_options || []}
                onChange={setSelectedValue}
              />
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

      {showVideo && question.video_url && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={closeVideoAndTrack}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h4 className="font-semibold text-foreground">Question Video</h4>
              <button
                onClick={closeVideoAndTrack}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video bg-black">
              <iframe
                src={toEmbedUrl(question.video_url)}
                title="Question video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
