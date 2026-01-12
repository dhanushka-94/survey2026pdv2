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
              <h3 className="text-lg font-semibold text-foreground">
                {survey.title}
              </h3>
              <span
                className={`px-2 py-1 text-xs font-medium rounded flex-shrink-0 ${
                  isCurrentlyActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {isCurrentlyActive ? 'Active' : 'Inactive'}
              </span>
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

            {/* Action Buttons - Wrap on mobile */}
            <div className="flex flex-wrap gap-2">
              <Link href={`/${adminPath}/surveys/${survey.id}`}>
                <Button variant="secondary" size="sm">
                  Edit
                </Button>
              </Link>
              <Link href={`/${adminPath}/surveys/${survey.id}/categories`}>
                <Button variant="secondary" size="sm">
                  Categories
                </Button>
              </Link>
              <Link href={`/${adminPath}/surveys/${survey.id}/questions`}>
                <Button variant="secondary" size="sm">
                  Questions
                </Button>
              </Link>
              <Link href={`/${adminPath}/surveys/${survey.id}/results`}>
                <Button variant="secondary" size="sm">
                  Results
                </Button>
              </Link>
              <Link href={`/${adminPath}/surveys/${survey.id}/responses`}>
                <Button variant="secondary" size="sm">
                  Responses
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleToggleStatus(survey.id, survey.is_active)}
                disabled={loading === survey.id}
              >
                {survey.is_active ? 'Deactivate' : 'Activate'}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(survey.id, survey.title)}
                disabled={loading === survey.id}
              >
                Delete
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
