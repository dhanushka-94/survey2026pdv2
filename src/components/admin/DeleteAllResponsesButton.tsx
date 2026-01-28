'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { deleteAllSurveyResponses } from '@/actions/responses';

interface DeleteAllResponsesButtonProps {
  surveyId: string;
  responseCount: number;
}

export function DeleteAllResponsesButton({ surveyId, responseCount }: DeleteAllResponsesButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAllSurveyResponses(surveyId);
      if (result.success) {
        alert(`Successfully deleted ${result.deletedCount || 0} responses from ${result.deletedSessions || 0} users!`);
        router.refresh();
      } else {
        alert(result.error || 'Failed to delete all responses');
      }
    } catch (error) {
      alert('An error occurred while deleting');
      console.error(error);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (responseCount === 0) {
    return null;
  }

  if (showConfirm) {
    return (
      <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg">
        <p className="text-sm font-semibold text-red-800 mb-2">
          ⚠️ Are you absolutely sure?
        </p>
        <p className="text-xs text-red-700 mb-4">
          This will permanently delete <strong>ALL {responseCount} responses</strong> from this survey.
          <br />
          This includes:
          <br />• All user answers
          <br />• All media view tracking
          <br />• All session tracking data
          <br />
          <strong>This action cannot be undone!</strong>
        </p>
        <div className="flex gap-2">
          <Button
            variant="danger"
            size="sm"
            onClick={handleDeleteAll}
            disabled={isDeleting}
          >
            {isDeleting ? '⏳ Deleting...' : '🗑️ Yes, Delete All'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowConfirm(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="danger"
      size="sm"
      onClick={() => setShowConfirm(true)}
    >
      🗑️ Delete All Responses ({responseCount})
    </Button>
  );
}
