'use client';

export function ClearHistoryButton() {
  const handleClear = () => {
    localStorage.removeItem('completed_surveys');
    window.location.reload();
  };

  return (
    <button
      onClick={handleClear}
      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
    >
      🔄 Clear History & Start Fresh
    </button>
  );
}
