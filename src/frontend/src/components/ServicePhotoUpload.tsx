import React from 'react';
import { GripVertical, X, AlertCircle, CheckCircle } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface ServicePhotoUploadProps {
  serviceId: string;
  photos: Array<{ base64: string; cropParams: any } | null>;
  onChange: (photos: Array<{ base64: string; cropParams: any } | null>) => void;
}

const ServicePhotoUpload: React.FC<ServicePhotoUploadProps> = ({
  serviceId,
  photos,
  onChange,
}) => {
  const handlePhotoChange = (index: number, imageData: any) => {
    const updatedPhotos = [...photos];
    updatedPhotos[index] = imageData;
    onChange(updatedPhotos);
  };

  const addPhotoSlot = () => {
    if (photos.length >= 5) return;
    onChange([...photos, null]);
  };

  const removePhotoSlot = (index: number) => {
    if (index === 0) return; // Can't remove main photo slot
    onChange(photos.filter((_, i) => i !== index));
  };

  const mainPhoto = photos[0];
  const hasMainPhoto = mainPhoto !== null && mainPhoto !== undefined;

  return (
    <div>
      {/* Main Photo */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <label className="input-label">Photo principale *</label>
          {hasMainPhoto ? (
            <CheckCircle size={16} style={{ color: '#22c55e' }} />
          ) : (
            <AlertCircle size={16} style={{ color: '#ef4444' }} />
          )}
        </div>
        <ImageUploader
          aspectRatio="1:1"
          storageKey={`nexus_service_${serviceId}_photo_0`}
          onChange={(data) => handlePhotoChange(0, data)}
          helpText="Format carré recommandé, max 5 Mo"
        />
      </div>

      {/* Additional Photos */}
      {photos.slice(1).map((photo, idx) => {
        const actualIndex = idx + 1;
        return (
          <div key={actualIndex} style={{ marginBottom: '24px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <GripVertical size={16} style={{ color: 'rgba(255, 255, 255, 0.35)', cursor: 'grab' }} />
              <label className="input-label">Photo supplémentaire {actualIndex}</label>
              <button
                onClick={() => removePhotoSlot(actualIndex)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(239, 68, 68, 0.8)',
                  cursor: 'pointer',
                  padding: '4px',
                  marginLeft: 'auto',
                }}
              >
                <X size={16} />
              </button>
            </div>
            <ImageUploader
              aspectRatio="1:1"
              storageKey={`nexus_service_${serviceId}_photo_${actualIndex}`}
              onChange={(data) => handlePhotoChange(actualIndex, data)}
            />
          </div>
        );
      })}

      {/* Add Photo Button */}
      {photos.length < 5 && (
        <button
          onClick={addPhotoSlot}
          style={{
            width: '100%',
            padding: '16px',
            background: 'rgba(232, 213, 176, 0.05)',
            border: '1px dashed rgba(232, 213, 176, 0.3)',
            borderRadius: '12px',
            color: '#E8D5B0',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 300ms',
          }}
        >
          + Ajouter une photo ({photos.length}/5)
        </button>
      )}
    </div>
  );
};

export default ServicePhotoUpload;
