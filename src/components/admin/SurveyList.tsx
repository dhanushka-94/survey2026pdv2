'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDate, formatDateTime, isSurveyActive } from '@/lib/utils';
import { toggleSurveyStatus, deleteSurvey } from '@/actions/surveys';
import { Button } from '@/components/ui/Button';

interface Survey {
  id: string;
  title: string;
  description: string | null;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

interface SurveyListProps {
  surveys: Survey[];
  adminPath: string;
}

export function SurveyList({ surveys, adminPath }: SurveyListProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setLoading(id);
    const result = await toggleSurveyStatus(id, !currentStatus);
    setLoading(null);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This will delete all associated categories, questions, and responses.`)) {
      return;
    }

    setLoading(id);
    const result = await deleteSurvey(id);
    setLoading(null);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  if (surveys.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No surveys yet</p>
        <Link href={`/${adminPath}/surveys/new`}>
          <Button>Create your first survey</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {surveys.map((survey) => {
        const isCurrentlyActive = isSurveyActive(
          survey.is_active,
          survey.start_date,
          survey.end_date
        );

        return (
          <div
            key={survey.id}
            className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
          >
            {/* Header with title and status */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {survey.title}
                </h3>
                {!survey.is_active && (
                  <p className="text-xs text-orange-600 mt-1 font-medium">
                    ⚠️ This survey is inactive - click "Activate" below to make it live
                  </p>
                )}
                {survey.is_active && !isCurrentlyActive && (
                  <p className="text-xs text-orange-600 mt-1 font-medium">
                    ⚠️ Survey is marked active but dates are blocking it (start date: {survey.start_date ? new Date(survey.start_date).toLocaleDateString() : 'none'})
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 items-end">
                <span
                  className={`px-3 py-1 text-sm font-bold rounded-full flex-shrink-0 ${
                    isCurrentlyActive
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {isCurrentlyActive ? '🟢 LIVE' : '🔴 OFFLINE'}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded flex-shrink-0 ${
                    survey.is_active
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  DB: {survey.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Description */}
            {survey.description && (
              <p className="text-sm text-muted-foreground mb-3">
                {survey.description}
              </p>
            )}

            {/* Dates */}
            <div className="text-xs text-muted-foreground space-y-1 mb-4">
              <p>Created: {formatDateTime(survey.created_at)}</p>
              {survey.start_date && (
                <p>Start: {formatDate(survey.start_date)}</p>
              )}
              {survey.end_date && (
                <p>End: {formatDate(survey.end_date)}</p>
              )}
            </div>

            {/* Primary Action - Activate/Deactivate */}
            {!survey.is_active && (
              <div className="mb-4 p-3 bg-orange-50 border-2 border-orange-300 rounded-lg">
                <p className="text-sm font-semibold text-orange-800 mb-2">
                  🚀 This survey is not active. Click below to make it live:
                </p>
                <Button
                  onClick={() => handleToggleStatus(survey.id, survey.is_active)}
                  disabled={loading === survey.id}
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  {loading === survey.id ? '⏳ Activating...' : '✅ Activate Survey Now'}
                </Button>
              </div>
            )}

            {survey.is_active && (
              <div className="mb-4 p-3 bg-green-50 border-2 border-green-300 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-green-800">
                    ✅ Survey is active in database
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleToggleStatus(survey.id, survey.is_active)}
                    disabled={loading === survey.id}
                  >
                    {loading === survey.id ? '⏳ Deactivating...' : '❌ Deactivate'}
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons - Wrap on mobile */}
            <div className="flex flex-wrap gap-2">
              <Link href={`/${adminPath}/surveys/${survey.id}`}>
                <Button variant="secondary" size="sm">
                  ✏️ Edit
                </Button>
              </Link>
              <Link href={`/${adminPath}/surveys/${survey.id}/categories`}>
                <Button variant="secondary" size="sm">
                  📁 Categories
                </Button>
              </Link>
              <Link href={`/${adminPath}/surveys/${survey.id}/questions`}>
                <Button variant="secondary" size="sm">
                  ❓ Questions
                </Button>
              </Link>
              <Link href={`/${adminPath}/surveys/${survey.id}/results`}>
                <Button variant="secondary" size="sm">
                  📊 Results
                </Button>
              </Link>
              <Link href={`/${adminPath}/surveys/${survey.id}/responses`}>
                <Button variant="secondary" size="sm">
                  💬 Responses
                </Button>
              </Link>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(survey.id, survey.title)}
                disabled={loading === survey.id}
              >
                🗑️ Delete
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
