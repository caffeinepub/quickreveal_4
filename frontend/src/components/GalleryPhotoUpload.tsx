import React from 'react';
import { GripVertical, X } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface GalleryPhotoUploadProps {
  photos: Array<{ base64: string; cropParams: any } | null>;
  onChange: (photos: Array<{ base64: string; cropParams: any } | null>) => void;
  minPhotos?: number;
}

const GalleryPhotoUpload: React.FC<GalleryPhotoUploadProps> = ({
  photos,
  onChange,
  minPhotos = 3,
}) => {
  const handlePhotoChange = (index: number, imageData: any) => {
    const updatedPhotos = [...photos];
    updatedPhotos[index] = imageData;
    onChange(updatedPhotos);
  };

  const addPhotoSlot = () => {
    onChange([...photos, null]);
  };

  const removePhotoSlot = (index: number) => {
    if (photos.length <= minPhotos) return;
    onChange(photos.filter((_, i) => i !== index));
  };

  // Ensure minimum number of slots
  const displayPhotos = [...photos];
  while (displayPhotos.length < minPhotos) {
    displayPhotos.push(null);
  }

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        {displayPhotos.map((photo, index) => (
          <div key={index} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <GripVertical size={14} style={{ color: 'rgba(255, 255, 255, 0.35)', cursor: 'grab' }} />
              <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Photo {index + 1}
              </span>
              {index >= minPhotos && (
                <button
                  onClick={() => removePhotoSlot(index)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(239, 68, 68, 0.8)',
                    cursor: 'pointer',
                    padding: '2px',
                    marginLeft: 'auto',
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <ImageUploader
              aspectRatio="1:1"
              storageKey={`nexus_builder_gallery_${index}`}
              onChange={(data) => handlePhotoChange(index, data)}
            />
          </div>
        ))}
      </div>

      <button
        onClick={addPhotoSlot}
        style={{
          width: '100%',
          padding: '12px',
          background: 'rgba(232, 213, 176, 0.05)',
          border: '1px dashed rgba(232, 213, 176, 0.3)',
          borderRadius: '12px',
          color: '#E8D5B0',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 300ms',
        }}
      >
        + Ajouter une photo
      </button>
    </div>
  );
};

export default GalleryPhotoUpload;
