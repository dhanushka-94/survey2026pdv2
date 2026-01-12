'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSurvey, updateSurvey } from '@/actions/surveys';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import type { Survey } from '@/lib/types';

interface SurveyFormProps {
  adminPath: string;
  survey?: Survey;
}

export function SurveyForm({ adminPath, survey }: SurveyFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: survey?.title || '',
    description: survey?.description || '',
    is_active: survey?.is_active || false,
    start_date: survey?.start_date ? survey.start_date.split('T')[0] : '',
    end_date: survey?.end_date ? survey.end_date.split('T')[0] : '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = survey
        ? await updateSurvey(survey.id, formData)
        : await createSurvey(formData);

      if (result.success) {
        router.push(`/${adminPath}/surveys`);
        router.refresh();
      } else {
        setError(result.error || 'Operation failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Title"
        placeholder="Enter survey title"
        value={formData.title}
        onChange={(e) =>
          setFormData({ ...formData, title: e.target.value })
        }
        required
        disabled={isLoading}
      />

      <Textarea
        label="Description"
        placeholder="Enter survey description (optional)"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        disabled={isLoading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          value={formData.start_date}
          onChange={(e) =>
            setFormData({ ...formData, start_date: e.target.value })
          }
          disabled={isLoading}
        />

        <Input
          label="End Date"
          type="date"
          value={formData.end_date}
          onChange={(e) =>
            setFormData({ ...formData, end_date: e.target.value })
          }
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) =>
            setFormData({ ...formData, is_active: e.target.checked })
          }
          disabled={isLoading}
          className="w-5 h-5 text-primary border-border rounded focus:ring-primary"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-foreground">
          Active Survey
        </label>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : survey ? 'Update Survey' : 'Create Survey'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push(`/${adminPath}/surveys`)}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
