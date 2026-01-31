'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getOrCreateSessionId, hasCompletedSurvey, markSurveyCompleted } from '@/lib/utils';
import { useGeolocation } from '@/lib/hooks/useGeolocation';
import { updateSessionTracking } from '@/actions/tracking';
import { DemographicsStep } from './DemographicsStep';
import { QuestionStep } from './QuestionStep';
import { CompletionScreen } from './CompletionScreen';
import { ProgressBar } from './ProgressBar';
import type { Survey, Category, Question, DemographicsData } from '@/lib/types';

interface SurveyFlowProps {
  survey: Survey;
  categories: Category[];
  questions: Question[];
}

export function SurveyFlow({ survey, categories, questions }: SurveyFlowProps) {
  const router = useRouter();
  const { latitude, longitude } = useGeolocation();
  const [sessionId, setSessionId] = useState('');
  const [currentStep, setCurrentStep] = useState(0); // 0 = demographics, 1+ = questions
  const [demographics, setDemographics] = useState<DemographicsData | null>(null);
  const [answers, setAnswers] = useState<Map<string, string>>(new Map());
  const [isCompleted, setIsCompleted] = useState(false);

  const gpsCoords = latitude != null && longitude != null ? { latitude, longitude } : undefined;

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
    return <CompletionScreen surveyTitle={survey.title} />;
  }

  if (currentStep === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-6 text-center">
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground mb-1">
            {survey.title}
          </h1>
          {survey.description && (
            <p className="text-sm text-muted-foreground">
              {survey.description}
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
    return <CompletionScreen surveyTitle={survey.title} />;
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

      <ProgressBar
        current={currentStep}
        total={questions.length}
        categoryName={currentCategory?.name}
      />

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
