'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { resetVisitorsAndLocationData } from '@/actions/visitors';
import { Button } from '@/components/ui/Button';

export function ResetVisitorsLocationsButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (
      !confirm(
        'Reset all visitor logs and clear GPS locations?\n\n' +
          'This will:\n' +
          '• Delete every row in Visitor Logs\n' +
          '• Remove stored coordinates from survey session tracking (responses are not deleted)\n\n' +
          'This cannot be undone.'
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const result = await resetVisitorsAndLocationData();
      if (result.success) {
        router.refresh();
        alert('Visitor logs and location data have been reset.');
      } else {
        alert(result.error || 'Reset failed.');
      }
    } catch {
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button type="button" variant="danger" size="sm" onClick={handleReset} disabled={loading}>
      {loading ? 'Resetting…' : 'Reset visitors & locations'}
    </Button>
  );
}
