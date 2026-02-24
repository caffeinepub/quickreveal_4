import React from 'react';
import { X } from 'lucide-react';
import { SiInstagram, SiTiktok, SiFacebook } from 'react-icons/si';

interface BuilderPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

const BuilderPreviewModal: React.FC<BuilderPreviewModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.95)',
        zIndex: 9999,
        overflow: 'auto',
        padding: '20px',
      }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: 'none',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          zIndex: 10000,
        }}
      >
        <X size={24} />
      </button>

      {/* Preview Content */}
      <div style={{ maxWidth: '600px', margin: '60px auto 40px', background: '#0a0a0a', borderRadius: '20px', overflow: 'hidden' }}>
        {/* Cover Photo */}
        {data.coverPhoto && (
          <div style={{ width: '100%', aspectRatio: '3/1', overflow: 'hidden' }}>
            <img src={data.coverPhoto} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        <div style={{ padding: '24px' }}>
          {/* Logo & Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            {data.logo && (
              <img src={data.logo} alt="Logo" style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />
            )}
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '4px' }}>{data.artistName || 'Nom du studio'}</h1>
              <p style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '14px' }}>
                {data.category} • {data.city}
              </p>
            </div>
          </div>

          {/* Badges */}
          {data.badges.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {data.badges.map((badge: string, idx: number) => (
                <span
                  key={idx}
                  style={{
                    background: 'rgba(232, 213, 176, 0.12)',
                    border: '1px solid #E8D5B0',
                    borderRadius: '999px',
                    padding: '6px 12px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#E8D5B0',
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          )}

          {/* Bio */}
          <p style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '16px', lineHeight: '1.6', marginBottom: '24px', color: 'rgba(255, 255, 255, 0.75)' }}>
            {data.bio || 'Votre bio apparaîtra ici...'}
          </p>

          {/* Social Media */}
          {(data.socialInstagram || data.socialTiktok || data.socialFacebook) && (
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              {data.socialInstagram && (
                <a href={`https://instagram.com/${data.socialInstagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#E8D5B0' }}>
                  <SiInstagram size={24} />
                </a>
              )}
              {data.socialTiktok && (
                <a href={`https://tiktok.com/@${data.socialTiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#E8D5B0' }}>
                  <SiTiktok size={24} />
                </a>
              )}
              {data.socialFacebook && (
                <a href={`https://facebook.com/${data.socialFacebook}`} target="_blank" rel="noopener noreferrer" style={{ color: '#E8D5B0' }}>
                  <SiFacebook size={24} />
                </a>
              )}
            </div>
          )}

          {/* Gallery */}
          {data.gallery.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Galerie</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {data.gallery.map((photo: string, idx: number) => (
                  <div key={idx} style={{ aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={photo} alt={`Gallery ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services */}
          {data.services.length > 0 && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Prestations</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {data.services.filter((s: any) => s.name && s.mainPhoto).map((service: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.09)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                    }}
                  >
                    {service.mainPhoto && (
                      <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                        <img src={service.mainPhoto} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: 700 }}>{service.name}</h4>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {service.badges.includes('populaire') && <span style={{ fontSize: '16px' }}>🔥</span>}
                          {service.badges.includes('nouveau') && <span style={{ fontSize: '16px' }}>✨</span>}
                        </div>
                      </div>
                      {service.shortDescription && (
                        <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.55)', marginBottom: '12px' }}>
                          {service.shortDescription}
                        </p>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.55)' }}>{service.duration}</span>
                        <span style={{ fontSize: '16px', fontWeight: 700, color: '#E8D5B0' }}>
                          {service.priceType === 'range'
                            ? `${service.priceMin}-${service.priceMax} CHF`
                            : `${service.priceDomicile || service.priceStudio} CHF`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuilderPreviewModal;
