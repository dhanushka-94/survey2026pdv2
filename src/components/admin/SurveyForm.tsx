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
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-foreground">
              Start Date (Optional)
            </label>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, start_date: '' })}
              className="text-xs text-primary hover:underline"
              disabled={isLoading}
            >
              Clear
            </button>
          </div>
          <Input
            type="date"
            value={formData.start_date}
            onChange={(e) =>
              setFormData({ ...formData, start_date: e.target.value })
            }
            disabled={isLoading}
            placeholder="Select start date"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Leave empty or select past/future date. Survey shows when active + date is reached.
          </p>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, start_date: new Date().toISOString().split('T')[0] })}
              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              disabled={isLoading}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                const firstDay = new Date();
                firstDay.setDate(1);
                setFormData({ ...formData, start_date: firstDay.toISOString().split('T')[0] });
              }}
              className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
              disabled={isLoading}
            >
              1st of Month
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-foreground">
              End Date (Optional)
            </label>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, end_date: '' })}
              className="text-xs text-primary hover:underline"
              disabled={isLoading}
            >
              Clear
            </button>
          </div>
          <Input
            type="date"
            value={formData.end_date}
            onChange={(e) =>
              setFormData({ ...formData, end_date: e.target.value })
            }
            disabled={isLoading}
            placeholder="Select end date"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Leave empty for no end date. Survey hides after this date.
          </p>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => {
                const lastDay = new Date();
                lastDay.setMonth(lastDay.getMonth() + 1);
                lastDay.setDate(0);
                setFormData({ ...formData, end_date: lastDay.toISOString().split('T')[0] });
              }}
              className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
              disabled={isLoading}
            >
              End of Month
            </button>
            <button
              type="button"
              onClick={() => {
                const nextMonth = new Date();
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                setFormData({ ...formData, end_date: nextMonth.toISOString().split('T')[0] });
              }}
              className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
              disabled={isLoading}
            >
              +1 Month
            </button>
          </div>
        </div>
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
