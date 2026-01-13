'use client';

import { useState } from 'react';

interface Survey {
  id: string;
  title: string;
  is_active: boolean;
}

export function ToggleTest({ survey }: { survey: Survey }) {
  const [isActive, setIsActive] = useState(survey.is_active);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleToggle = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/test-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surveyId: survey.id,
          newStatus: !isActive,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsActive(!isActive);
        setMessage('✅ Toggle successful!');
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 p-4 rounded mt-4">
      <h3 className="font-semibold mb-2">Direct Toggle Test:</h3>
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`px-4 py-2 rounded font-medium ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : isActive
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
      >
        {loading ? 'Testing...' : isActive ? 'Click to Deactivate' : 'Click to Activate'}
      </button>
      {message && (
        <p className="mt-2 text-sm font-medium">{message}</p>
      )}
    </div>
  );
}
