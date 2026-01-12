'use client';

import { useState, useRef } from 'react';
import { uploadMedia, deleteMedia } from '@/actions/questions';
import { Button } from '@/components/ui/Button';
import { isValidMediaFile, formatFileSize } from '@/lib/utils';

interface MediaUploadProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export function MediaUpload({ currentUrl, onUpload, onRemove, disabled }: MediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!isValidMediaFile(file)) {
      setError('Invalid file type. Please upload an image or video.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB');
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      const result = await uploadMedia(file);

      if (result.success && result.url) {
        onUpload(result.url);
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err) {
      setError('An error occurred during upload');
      console.error(err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    if (!currentUrl) return;

    if (!confirm('Are you sure you want to remove this media?')) {
      return;
    }

    setIsUploading(true);

    try {
      await deleteMedia(currentUrl);
      onRemove();
    } catch (err) {
      console.error('Error removing media:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">
        Media (optional)
      </label>

      {currentUrl ? (
        <div className="space-y-3">
          <div className="border border-border rounded-lg p-4">
            {currentUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <img
                src={currentUrl}
                alt="Uploaded media"
                className="max-w-sm rounded-lg"
              />
            ) : (
              <video
                src={currentUrl}
                controls
                className="max-w-sm rounded-lg"
              />
            )}
          </div>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleRemove}
            disabled={disabled || isUploading}
          >
            Remove Media
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            disabled={disabled || isUploading}
            className="block w-full text-sm text-foreground
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-medium
              file:bg-primary file:text-white
              file:cursor-pointer
              hover:file:bg-primary-hover
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground">
            Upload an image, video, or GIF (max 50MB)
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {isUploading && (
        <p className="text-sm text-muted-foreground">Uploading...</p>
      )}
    </div>
  );
}
