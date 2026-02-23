import React, { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { CropParams } from '../types/cropping';

interface CroppingModalProps {
  isOpen: boolean;
  imageData: {
    base64: string;
    cropParams?: CropParams | null;
  };
  aspectRatio: string; // '3:1' or '1:1'
  onSave: (cropParams: CropParams) => void;
  onCancel: () => void;
}

const CroppingModal: React.FC<CroppingModalProps> = ({
  isOpen,
  imageData,
  aspectRatio,
  onSave,
  onCancel,
}) => {
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  
  const mainCanvasRef = useRef<HTMLDivElement>(null);
  const previewCanvasRef = useRef<HTMLDivElement>(null);

  // Parse aspect ratio
  const [ratioW, ratioH] = aspectRatio.split(':').map(Number);
  const targetRatio = ratioW / ratioH;

  // Load image dimensions
  useEffect(() => {
    if (!imageData.base64) return;
    
    const img = new Image();
    img.onload = () => {
      setOriginalWidth(img.naturalWidth);
      setOriginalHeight(img.naturalHeight);
      
      // Initialize with existing crop params if available
      if (imageData.cropParams) {
        setScale(imageData.cropParams.scale);
        setOffsetX(imageData.cropParams.offsetX);
        setOffsetY(imageData.cropParams.offsetY);
      }
    };
    img.src = imageData.base64;
  }, [imageData]);

  // Handle pointer down (mouse or touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  // Handle pointer move
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    // Convert pixel movement to percentage offset
    // Sensitivity factor to make dragging feel natural
    const sensitivity = 0.1;
    setOffsetX(prev => Math.max(-50, Math.min(50, prev + deltaX * sensitivity)));
    setOffsetY(prev => Math.max(-50, Math.min(50, prev + deltaY * sensitivity)));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Handle pointer up
  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Handle save
  const handleSave = () => {
    const cropParams: CropParams = {
      scale,
      offsetX,
      offsetY,
      imageBase64: imageData.base64,
      originalWidth,
      originalHeight,
    };
    onSave(cropParams);
  };

  if (!isOpen) return null;

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(10, 10, 10, 0.95)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  };

  const contentStyle: React.CSSProperties = {
    background: '#1a1a1a',
    borderRadius: '20px',
    padding: '32px',
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
  };

  const mainCanvasStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '600px',
    aspectRatio: aspectRatio.replace(':', '/'),
    margin: '0 auto 24px',
    border: '2px solid rgba(232, 213, 176, 0.3)',
    borderRadius: '12px',
    overflow: 'hidden',
    position: 'relative',
    cursor: isDragging ? 'grabbing' : 'grab',
    touchAction: 'none',
  };

  const imageStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%) scale(${scale}) translate(${offsetX}%, ${offsetY}%)`,
    width: 'auto',
    height: 'auto',
    maxWidth: 'none',
    maxHeight: 'none',
    minWidth: '100%',
    minHeight: '100%',
    objectFit: 'cover',
    userSelect: 'none',
    pointerEvents: 'none',
  };

  const previewStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '300px',
    aspectRatio: aspectRatio.replace(':', '/'),
    margin: '0 auto 24px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative',
  };

  return (
    <div style={containerStyle} onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div style={contentStyle}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
            Ajuster le cadrage
          </h2>
          <button
            onClick={onCancel}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.55)',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Instructions */}
        <p style={{ color: 'rgba(255, 255, 255, 0.55)', marginBottom: '24px', fontSize: '14px' }}>
          Glissez l'image pour la repositionner et utilisez le curseur pour zoomer
        </p>

        {/* Main canvas */}
        <div
          ref={mainCanvasRef}
          style={mainCanvasStyle}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <img src={imageData.base64} alt="Crop preview" style={imageStyle} />
        </div>

        {/* Zoom controls */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '600px', margin: '0 auto' }}>
            <ZoomOut size={20} style={{ color: 'rgba(255, 255, 255, 0.55)' }} />
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              style={{
                flex: 1,
                height: '4px',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '2px',
                outline: 'none',
                cursor: 'pointer',
              }}
            />
            <ZoomIn size={20} style={{ color: 'rgba(255, 255, 255, 0.55)' }} />
            <span style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '14px', minWidth: '50px' }}>
              {Math.round(scale * 100)}%
            </span>
          </div>
        </div>

        {/* Preview */}
        <div>
          <p style={{ color: 'rgba(255, 255, 255, 0.55)', marginBottom: '12px', fontSize: '12px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Aperçu du rendu final
          </p>
          <div ref={previewCanvasRef} style={previewStyle}>
            <img src={imageData.base64} alt="Final preview" style={imageStyle} />
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '32px' }}>
          <button
            onClick={onCancel}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '999px',
              color: 'rgba(255, 255, 255, 0.55)',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              padding: '12px 32px',
              cursor: 'pointer',
              transition: 'all 300ms',
            }}
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            style={{
              background: '#E8D5B0',
              border: 'none',
              borderRadius: '999px',
              color: '#0a0a0a',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              padding: '12px 32px',
              cursor: 'pointer',
              transition: 'all 300ms',
            }}
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default CroppingModal;
