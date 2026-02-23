import { useState, useCallback, DragEvent, ChangeEvent } from 'react';

interface UseImageUploadReturn {
  preview: string | null;
  error: string | null;
  isUploading: boolean;
  handleDragOver: (e: DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: DragEvent<HTMLDivElement>) => void;
  handleFileInput: (e: ChangeEvent<HTMLInputElement>) => void;
  reset: () => void;
}

const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const useImageUpload = (
  onUpload: (base64: string) => void
): UseImageUploadReturn => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const validateAndConvert = useCallback(
    async (file: File) => {
      setError(null);
      setIsUploading(true);

      // Validate format
      if (!ALLOWED_FORMATS.includes(file.type)) {
        setError('Format non supporté. Utilisez JPG, PNG ou WebP.');
        setIsUploading(false);
        return;
      }

      // Validate size
      if (file.size > MAX_FILE_SIZE) {
        setError('Fichier trop volumineux. Maximum 5MB.');
        setIsUploading(false);
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setPreview(base64);
        onUpload(base64);
        setIsUploading(false);
      };
      reader.onerror = () => {
        setError('Erreur lors de la lecture du fichier.');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    },
    [onUpload]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        validateAndConvert(files[0]);
      }
    },
    [validateAndConvert]
  );

  const handleFileInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        validateAndConvert(files[0]);
      }
    },
    [validateAndConvert]
  );

  const reset = useCallback(() => {
    setPreview(null);
    setError(null);
    setIsUploading(false);
  }, []);

  return {
    preview,
    error,
    isUploading,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput,
    reset,
  };
};

