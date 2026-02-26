import React from 'react';

// Local preview-only service shape — compatible with both ServiceItem and ProData.services entries
interface PreviewService {
  id?: string;
  name?: string;
  nom?: string;
  price?: number;
  prix?: number;
  duration?: number;
  duree?: number;
}

interface ExplorerPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  proName: string;
  city: string;
  category: string;
  location: string;
  services: PreviewService[];
  mainPhoto?: string | null;
}

export default function ExplorerPreview({
  isOpen,
  onClose,
  proName,
  city,
  category,
  location,
  services,
  mainPhoto,
}: ExplorerPreviewProps) {
  if (!isOpen) return null;

  const locationLabel =
    location === 'domicile' ? 'À domicile' : location === 'salon' ? 'En salon' : 'Domicile & Salon';

  const initials = proName
    ? proName.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'PR';

  // Normalise service fields — supports both English (ServiceItem) and French (ProData.services) shapes
  const normalisedServices = services.map((s) => ({
    id: s.id || String(Math.random()),
    name: s.name || s.nom || '',
    price: s.price ?? s.prix ?? 0,
    duration: s.duration ?? s.duree ?? 0,
  }));

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          zIndex: 300,
        }}
      />
      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 380,
          background: '#0F0F14',
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.1)',
          zIndex: 301,
          overflow: 'hidden',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        {/* Preview label */}
        <div
          style={{
            background: 'rgba(212,175,55,0.15)',
            borderBottom: '1px solid rgba(212,175,55,0.2)',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ color: '#D4AF37', fontSize: 12, fontWeight: 700, letterSpacing: '1px' }}>
            👁 APERÇU EXPLORER
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              fontSize: 18,
              cursor: 'pointer',
              padding: 0,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Cover image */}
        <div
          style={{
            width: '100%',
            height: 140,
            background: mainPhoto
              ? `url(${mainPhoto}) center/cover no-repeat`
              : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7) 100%)',
            }}
          />
        </div>

        {/* Profile info */}
        <div style={{ padding: '0 16px 16px' }}>
          {/* Avatar + name row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 12,
              marginTop: -24,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#050507',
                fontWeight: 800,
                fontSize: 18,
                border: '3px solid #0F0F14',
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div style={{ flex: 1, paddingBottom: 4 }}>
              <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 16 }}>
                {proName || 'Votre nom'}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                {city || 'Votre ville'} · {category || 'Catégorie'}
              </div>
            </div>
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            <span
              style={{
                background: 'rgba(212,175,55,0.15)',
                border: '1px solid rgba(212,175,55,0.3)',
                color: '#D4AF37',
                fontSize: 11,
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: 20,
              }}
            >
              📍 {locationLabel}
            </span>
            {normalisedServices.length > 0 && (
              <span
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: 20,
                }}
              >
                {normalisedServices.length} service{normalisedServices.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Services list */}
          {normalisedServices.length > 0 ? (
            <div>
              <div
                style={{
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  marginBottom: 8,
                }}
              >
                SERVICES
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {normalisedServices.slice(0, 4).map((svc) => (
                  <div
                    key={svc.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      background: 'rgba(255,255,255,0.04)',
                      borderRadius: 8,
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div>
                      <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600 }}>{svc.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{svc.duration} min</div>
                    </div>
                    <div style={{ color: '#D4AF37', fontWeight: 700, fontSize: 14 }}>
                      CHF {svc.price}
                    </div>
                  </div>
                ))}
                {normalisedServices.length > 4 && (
                  <div
                    style={{
                      color: 'rgba(255,255,255,0.3)',
                      fontSize: 12,
                      textAlign: 'center',
                      padding: '4px 0',
                    }}
                  >
                    +{normalisedServices.length - 4} autres services
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: '16px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 8,
                textAlign: 'center',
                color: 'rgba(255,255,255,0.3)',
                fontSize: 13,
              }}
            >
              Aucun service ajouté
            </div>
          )}
        </div>
      </div>
    </>
  );
}
