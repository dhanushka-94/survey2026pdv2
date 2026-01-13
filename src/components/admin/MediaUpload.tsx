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

// Helper function to compress images
async function compressImage(file: File, maxSizeMB = 3): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions (max 1920px width)
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1920;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Try different quality levels until under maxSizeMB
        let quality = 0.9;
        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Compression failed'));
                return;
              }

              const compressedSize = blob.size / 1024 / 1024; // Size in MB

              if (compressedSize > maxSizeMB && quality > 0.1) {
                quality -= 0.1;
                tryCompress();
              } else {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              }
            },
            'image/jpeg',
            quality
          );
        };

        tryCompress();
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

export function MediaUpload({ currentUrl, onUpload, onRemove, disabled }: MediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!isValidMediaFile(file)) {
      setError('Invalid file type. Please upload an image or video.');
      return;
    }

    // Check initial file size
    const fileSizeMB = file.size / 1024 / 1024;
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    // Vercel Hobby plan limit is 4.5MB, so we set 4MB to be safe
    const MAX_SIZE_MB = 4;

    if (isVideo && fileSizeMB > 10) {
      setError('Video size must be less than 10MB. Please compress your video first.');
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      let fileToUpload = file;

      // Compress images if needed
      if (isImage && fileSizeMB > MAX_SIZE_MB) {
        setUploadProgress('Compressing image...');
        const originalSize = (fileSizeMB).toFixed(2);
        fileToUpload = await compressImage(file, MAX_SIZE_MB);
        const newSize = (fileToUpload.size / 1024 / 1024).toFixed(2);
        setUploadProgress(`Compressed: ${originalSize}MB → ${newSize}MB`);
      }

      // Final size check
      const finalSizeMB = fileToUpload.size / 1024 / 1024;
      if (finalSizeMB > MAX_SIZE_MB) {
        setError(`File too large (${finalSizeMB.toFixed(2)}MB). Max: ${MAX_SIZE_MB}MB. Please use a smaller file.`);
        setIsUploading(false);
        return;
      }

      setUploadProgress('Uploading...');
      const result = await uploadMedia(fileToUpload);

      if (result.success && result.url) {
        onUpload(result.url);
        setUploadProgress('');
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err) {
      setError('An error occurred during upload. Try a smaller file.');
      console.error(err);
    } finally {
      setIsUploading(false);
      setUploadProgress('');
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
            📸 Images: Auto-compressed to 4MB | 🎥 Videos: Max 10MB
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {uploadProgress && (
        <p className="text-sm text-blue-600 font-medium">{uploadProgress}</p>
      )}

      {isUploading && !uploadProgress && (
        <p className="text-sm text-muted-foreground">Processing...</p>
      )}
    </div>
  );
}
