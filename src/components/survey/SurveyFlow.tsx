'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getOrCreateSessionId,
  hasCompletedSurvey,
  markSurveyCompleted,
  surveyExpiresAt,
} from '@/lib/utils';
import { useGeolocation } from '@/lib/hooks/useGeolocation';
import { updateSessionTracking } from '@/actions/tracking';
import { DemographicsStep } from './DemographicsStep';
import { QuestionStep } from './QuestionStep';
import { CompletionScreen } from './CompletionScreen';
import { ProgressBar } from './ProgressBar';
import { SurveyExpiryCountdown } from './SurveyExpiryCountdown';
import type { Survey, Category, Question, DemographicsData, Reward } from '@/lib/types';

interface SurveyFlowProps {
  survey: Survey;
  categories: Category[];
  questions: Question[];
  finalReward?: Reward | null;
}

export function SurveyFlow({ survey, categories, questions, finalReward }: SurveyFlowProps) {
  const router = useRouter();
  const { latitude, longitude } = useGeolocation();
  const [sessionId, setSessionId] = useState('');
  const [currentStep, setCurrentStep] = useState(0); // 0 = demographics, 1+ = questions
  const [demographics, setDemographics] = useState<DemographicsData | null>(null);
  const [answers, setAnswers] = useState<Map<string, string>>(new Map());
  const [isCompleted, setIsCompleted] = useState(false);

  const gpsCoords = latitude != null && longitude != null ? { latitude, longitude } : undefined;

  const expiresAt = surveyExpiresAt(survey);

  const rawDescription = survey.description || '';
  const descriptionWithoutAffiliation = rawDescription
    .replace(/Affiliation:[^\n]*\n?/gi, '')
    .trim();
  const voluntaryMatch = descriptionWithoutAffiliation.match(
    /Voluntary Participation:\s*([\s\S]*)/i
  );

  useEffect(() => {
    // Get or create session ID (will be new if coming from "Take Another Survey")
    const id = getOrCreateSessionId();
    setSessionId(id);

    // Check if this session has already completed this specific survey
    if (hasCompletedSurvey(survey.id)) {
      setIsCompleted(true);
    }
  }, [survey.id]);

  useEffect(() => {
    if (!sessionId) return;

    // Track demographics step
    if (currentStep === 0) {
      updateSessionTracking({
        survey_id: survey.id,
        session_id: sessionId,
        current_page: 0,
        ...gpsCoords,
      });
    }
  }, [currentStep, sessionId, survey.id, latitude, longitude]);

  const handleDemographicsSubmit = (data: DemographicsData) => {
    setDemographics(data);
    setCurrentStep(1);
  };

  const handleQuestionAnswer = (questionId: string, answerValue: string) => {
    setAnswers(new Map(answers.set(questionId, answerValue)));

    // Move to next question or completion
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Survey completed - mark as complete and end session
      markSurveyCompleted(survey.id);
      // End the current session so a new one is created next time
      if (typeof window !== 'undefined') {
        localStorage.removeItem('survey_session_id');
      }
      setIsCompleted(true);
    }
  };

  if (isCompleted) {
    return <CompletionScreen surveyTitle={survey.title} reward={finalReward} />;
  }

  if (currentStep === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-6 text-center">
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground mb-1">
            {survey.title}
          </h1>
        </div>

        <div className="space-y-4 mb-6">
          <div className="rounded-xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 p-4">
            <p className="text-base sm:text-lg font-bold text-amber-800">
              🎁 Finish survey and get reward coupon code
            </p>
            <p className="text-sm font-semibold text-red-600 mt-1">
              ⏳ Limited time available
            </p>
            {expiresAt && (
              <SurveyExpiryCountdown expiresAtIso={expiresAt} variant="hero" />
            )}
            {finalReward?.title && (
              <p className="text-sm text-amber-700 mt-2">
                Current reward: <span className="font-semibold">{finalReward.title}</span>
              </p>
            )}
          </div>

          {survey.block_multiple_submissions_per_device && (
            <div className="rounded-xl border border-red-300 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">
                Notice: This survey allows up to 3 submissions per device.
              </p>
            </div>
          )}

          {voluntaryMatch?.[1] && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-700 mb-1">Voluntary Participation</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {voluntaryMatch[1].trim()}
              </p>
            </div>
          )}

          {!voluntaryMatch?.[1] && descriptionWithoutAffiliation && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {descriptionWithoutAffiliation}
            </p>
          )}
        </div>
        <DemographicsStep onSubmit={handleDemographicsSubmit} />
      </div>
    );
  }

  const currentQuestion = questions[currentStep - 1];
  const currentCategory = categories.find(
    (cat) => cat.id === currentQuestion?.category_id
  );

  if (!currentQuestion) {
    return <CompletionScreen surveyTitle={survey.title} reward={finalReward} />;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Privacy Notice Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-lighter to-pink-50 border border-primary/30 rounded-full shadow-sm">
          <span className="text-xl">🔒</span>
          <span className="text-sm font-medium text-primary">
            100% Anonymous & Secure Survey
          </span>
          <span className="text-xl">💖</span>
        </div>
      </div>

      {survey.block_multiple_submissions_per_device && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-center text-xs sm:text-sm font-medium text-red-700">
          Submission limit enabled: max 3 submissions per device.
        </div>
      )}

      <ProgressBar
        current={currentStep}
        total={questions.length}
        categoryName={currentCategory?.name}
      />

      {expiresAt && (
        <SurveyExpiryCountdown expiresAtIso={expiresAt} variant="banner" />
      )}

      <QuestionStep
        question={currentQuestion}
        sessionId={sessionId}
        surveyId={survey.id}
        demographics={demographics!}
        onAnswer={handleQuestionAnswer}
        questionNumber={currentStep}
        totalQuestions={questions.length}
        latitude={latitude ?? undefined}
        longitude={longitude ?? undefined}
      />
    </div>
  );
}
