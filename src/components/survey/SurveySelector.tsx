'use client';

import Link from 'next/link';
import { hasCompletedSurvey } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Survey } from '@/lib/types';

interface SurveySelectorProps {
  surveys: Survey[];
}

export function SurveySelector({ surveys }: SurveySelectorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-pink-50 to-red-50 p-6">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 heart-pulse">💖</div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500 mb-3">
            Available Surveys
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose a survey to share your anonymous feedback
          </p>
        </div>

        {/* Privacy Badge */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-lighter to-pink-50 border border-primary/30 rounded-full shadow-sm">
            <span className="text-2xl">🔒</span>
            <span className="text-sm font-medium text-primary">
              100% Anonymous & Secure
            </span>
            <span className="text-2xl">💖</span>
          </div>
        </div>

        {/* Survey List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {surveys.map((survey, index) => {
            const isCompleted = hasCompletedSurvey(survey.id);
            
            return (
              <Card 
                key={survey.id} 
                className={`border-2 transition-all hover:shadow-xl ${
                  isCompleted 
                    ? 'border-green-300 bg-green-50/50' 
                    : 'border-primary/20 hover:border-primary/40'
                }`}
              >
                <CardContent className="pt-6 pb-6">
                  {/* Survey Number Badge */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0 ${
                      isCompleted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gradient-to-br from-primary to-pink-500 text-white'
                    }`}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-foreground mb-2">
                        {survey.title}
                      </h2>
                      {survey.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {survey.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4">
                    {isCompleted ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        <span>✓</span>
                        <span>Completed</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        <span>📝</span>
                        <span>Available</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <Link href={`/survey/${survey.id}`}>
                    <Button 
                      className="w-full" 
                      variant={isCompleted ? "secondary" : "primary"}
                    >
                      {isCompleted ? (
                        <>
                          <span>🔄</span>
                          <span className="ml-2">Retake Survey</span>
                        </>
                      ) : (
                        <>
                          <span>▶️</span>
                          <span className="ml-2">Start Survey</span>
                        </>
                      )}
                    </Button>
                  </Link>

                  {/* Date Info */}
                  {(survey.start_date || survey.end_date) && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="text-xs text-muted-foreground space-y-1">
                        {survey.start_date && (
                          <p>
                            📅 Started: {new Date(survey.start_date).toLocaleDateString()}
                          </p>
                        )}
                        {survey.end_date && (
                          <p>
                            ⏰ Ends: {new Date(survey.end_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Your responses are completely anonymous and secure 🔒
          </p>
        </div>
      </div>
    </div>
  );
}
