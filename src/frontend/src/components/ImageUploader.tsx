import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, Edit2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { CropParams } from '../types/cropping';
import CroppingModal from './CroppingModal';
import { compressBase64Image, getLocalStorageUsage } from '../utils/imageCompression';

interface ImageUploaderProps {
  aspectRatio: string; // '3:1' or '1:1'
  storageKey: string;
  onChange?: (imageData: { base64: string; cropParams: CropParams | null } | null) => void;
  label?: string;
  helpText?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  aspectRatio,
  storageKey,
  onChange,
  label,
  helpText,
}) => {
  const [imageData, setImageData] = useState<{ base64: string; cropParams: CropParams | null } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing image from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setImageData(parsed);
        if (onChange) onChange(parsed);
      } catch (e) {
        console.error('Failed to parse stored image data:', e);
      }
    }
  }, [storageKey]);

  // Validate file
  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Format non supporté. Utilisez JPG, PNG ou WebP');
      return false;
    }

    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      toast.error('Fichier trop volumineux (max 5 Mo)');
      return false;
    }

    return true;
  };

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onload = async () => {
      let base64 = reader.result as string;
      
      // Check localStorage usage and compress if needed
      const currentUsage = getLocalStorageUsage();
      const maxUsage = 8 * 1024 * 1024; // 8 MB
      
      if (currentUsage > maxUsage) {
        toast('Image compressée pour économiser l\'espace', { duration: 3000 });
        base64 = await compressBase64Image(base64, 0.85);
      }

      // Load image to get dimensions
      const img = new Image();
      img.onload = () => {
        const newImageData = {
          base64,
          cropParams: {
            scale: 1,
            offsetX: 0,
            offsetY: 0,
            imageBase64: base64,
            originalWidth: img.naturalWidth,
            originalHeight: img.naturalHeight,
          },
        };
        
        setImageData(newImageData);
        
        // Open cropping modal automatically
        setIsEditing(true);
      };
      img.src = base64;
    };
    reader.readAsDataURL(file);
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Handle save from cropping modal
  const handleSaveCrop = (cropParams: CropParams) => {
    const updatedImageData = {
      base64: cropParams.imageBase64,
      cropParams,
    };
    
    setImageData(updatedImageData);
    localStorage.setItem(storageKey, JSON.stringify(updatedImageData));
    
    if (onChange) onChange(updatedImageData);
    
    setIsEditing(false);
    toast.success('Cadrage enregistré avec succès');
  };

  // Handle delete
  const handleDelete = () => {
    setImageData(null);
    localStorage.removeItem(storageKey);
    if (onChange) onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Calculate container dimensions based on aspect ratio
  const [ratioW, ratioH] = aspectRatio.split(':').map(Number);
  const isSquare = ratioW === ratioH;
  
  const containerStyle: React.CSSProperties = {
    border: `2px dashed ${isDragOver ? '#E8D5B0' : 'rgba(232, 213, 176, 0.3)'}`,
    borderRadius: '16px',
    padding: imageData ? '0' : '40px',
    textAlign: 'center',
    cursor: 'pointer',
    background: imageData ? 'transparent' : isDragOver ? 'rgba(232, 213, 176, 0.08)' : 'rgba(232, 213, 176, 0.05)',
    position: 'relative',
    overflow: 'hidden',
    aspectRatio: aspectRatio.replace(':', '/'),
    transition: 'all 300ms',
    minHeight: isSquare ? '150px' : '120px',
  };

  const imageContainerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '14px',
  };

  const imageStyle: React.CSSProperties = imageData?.cropParams ? {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%) scale(${imageData.cropParams.scale}) translate(${imageData.cropParams.offsetX}%, ${imageData.cropParams.offsetY}%)`,
    width: 'auto',
    height: 'auto',
    maxWidth: 'none',
    maxHeight: 'none',
    minWidth: '100%',
    minHeight: '100%',
    objectFit: 'cover',
  } : {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  return (
    <>
      <div>
        {label && (
          <label className="input-label" style={{ display: 'block', marginBottom: '12px' }}>
            {label}
          </label>
        )}
        {helpText && (
          <p style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '12px', marginBottom: '12px' }}>
            {helpText}
          </p>
        )}
        
        <div
          style={containerStyle}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !imageData && fileInputRef.current?.click()}
        >
          {imageData ? (
            <div style={imageContainerStyle}>
              <img src={imageData.base64} alt="Uploaded" style={imageStyle} />
              
              {/* Success indicator */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(34, 197, 94, 0.9)',
                  borderRadius: '50%',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle size={16} style={{ color: '#fff' }} />
              </div>
              
              {/* Action buttons */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  display: 'flex',
                  gap: '8px',
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  style={{
                    background: 'rgba(232, 213, 176, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#0a0a0a',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  <Edit2 size={14} /> Ajuster
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  style={{
                    background: 'rgba(239, 68, 68, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    padding: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <Upload size={32} style={{ color: '#E8D5B0', margin: '0 auto 12px' }} />
              <p style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '14px', marginBottom: '8px' }}>
                Glissez une image ou cliquez pour parcourir
              </p>
              <p style={{ color: '#E8D5B0', fontSize: '12px', fontStyle: 'italic' }}>
                Formats acceptés : JPG, PNG, WebP (max 5 Mo)
              </p>
            </div>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
      </div>

      {/* Cropping Modal */}
      {imageData && (
        <CroppingModal
          isOpen={isEditing}
          imageData={imageData}
          aspectRatio={aspectRatio}
          onSave={handleSaveCrop}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </>
  );
};

export default ImageUploader;
