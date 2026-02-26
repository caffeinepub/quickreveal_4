import React, { useState, useEffect } from 'react';

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  duration: number;
  category: string;
  badge?: string | null;
  mode?: string;
}

interface ServiceEditorProps {
  service: ServiceItem | null;
  onSave: (service: ServiceItem) => void;
  onClose: () => void;
}

const CATEGORIES = ['Coupe', 'Coloration', 'Soin', 'Barbe', 'Massage', 'Épilation', 'Manucure', 'Maquillage', 'Autre'];
const BADGES = ['Nouveau', 'Populaire', 'Promo', 'Exclusif'];
const MODES = ['À domicile', 'En studio', 'Les deux'];

export default function ServiceEditor({ service, onSave, onClose }: ServiceEditorProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('60');
  const [category, setCategory] = useState('');
  const [badge, setBadge] = useState<string | null>(null);
  const [mode, setMode] = useState('Les deux');

  useEffect(() => {
    if (service) {
      setName(service.name);
      setPrice(String(service.price));
      setDuration(String(service.duration));
      setCategory(service.category);
      setBadge(service.badge || null);
      setMode(service.mode || 'Les deux');
    } else {
      setName('');
      setPrice('');
      setDuration('60');
      setCategory('');
      setBadge(null);
      setMode('Les deux');
    }
  }, [service]);

  const handleSave = () => {
    if (!name.trim() || !price || !category) return;
    onSave({
      id: service?.id || `svc-${Date.now()}`,
      name: name.trim(),
      price: Number(price),
      duration: Number(duration),
      category,
      badge,
      mode,
    });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#121219',
    border: '1px solid #1C1C26',
    borderRadius: 10,
    padding: '12px 14px',
    color: '#F4F4F8',
    fontFamily: 'Inter',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: 600,
    color: '#9898B4',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: 6,
    display: 'block',
  };

  const canSave = name.trim() && price && category;

  return (
    /* ── OVERLAY ── */
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5,5,7,0.85)',
        zIndex: 9000,
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      {/* ── SHEET — stops above the 64px tab bar ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxHeight: 'calc(100vh - 64px - env(safe-area-inset-bottom, 0px))',
          display: 'flex',
          flexDirection: 'column',
          background: '#0D0D13',
          borderRadius: '24px 24px 0 0',
          border: '1px solid rgba(255,255,255,0.06)',
          borderBottom: 'none',
        }}
      >
        {/* Drag handle */}
        <div style={{
          width: 36,
          height: 4,
          background: '#2E2E3E',
          borderRadius: 2,
          margin: '12px auto',
          flexShrink: 0,
        }} />

        {/* Fixed title */}
        <div style={{
          padding: '0 24px 16px',
          flexShrink: 0,
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          <p style={{
            fontFamily: 'Inter',
            fontWeight: 800,
            fontSize: 20,
            color: '#F4F4F8',
            margin: 0,
          }}>
            {service ? 'Modifier le service' : 'Ajouter un service'}
          </p>
        </div>

        {/* Scrollable form */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch' as any,
          padding: '20px 24px',
        }}>
          {/* Nom */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Nom du service *</label>
            <input
              style={inputStyle}
              placeholder="Ex: Coupe + Barbe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Prix + Durée */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Prix (CHF) *</label>
              <input
                style={inputStyle}
                type="number"
                placeholder="50"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Durée (min)</label>
              <select
                style={{ ...inputStyle, appearance: 'none' }}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                {[15, 30, 45, 60, 75, 90, 120].map((d) => (
                  <option key={d} value={d}>{d} min</option>
                ))}
              </select>
            </div>
          </div>

          {/* Catégorie */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Catégorie *</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: '6px 14px',
                    background: category === cat ? '#F2D06B' : '#121219',
                    border: `1px solid ${category === cat ? '#F2D06B' : '#1C1C26'}`,
                    borderRadius: 20,
                    color: category === cat ? '#050507' : '#9898B4',
                    fontFamily: 'Inter',
                    fontSize: 13,
                    fontWeight: category === cat ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Badge optionnel */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Badge (optionnel)</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={() => setBadge(null)}
                style={{
                  padding: '6px 14px',
                  background: badge === null ? '#F2D06B' : '#121219',
                  border: `1px solid ${badge === null ? '#F2D06B' : '#1C1C26'}`,
                  borderRadius: 20,
                  color: badge === null ? '#050507' : '#9898B4',
                  fontFamily: 'Inter',
                  fontSize: 13,
                  fontWeight: badge === null ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                Aucun
              </button>
              {BADGES.map((b) => (
                <button
                  key={b}
                  onClick={() => setBadge(b)}
                  style={{
                    padding: '6px 14px',
                    background: badge === b ? '#F2D06B' : '#121219',
                    border: `1px solid ${badge === b ? '#F2D06B' : '#1C1C26'}`,
                    borderRadius: 20,
                    color: badge === b ? '#050507' : '#9898B4',
                    fontFamily: 'Inter',
                    fontSize: 13,
                    fontWeight: badge === b ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Mode prestation */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Mode de prestation</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {MODES.map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    padding: '6px 14px',
                    background: mode === m ? '#F2D06B' : '#121219',
                    border: `1px solid ${mode === m ? '#F2D06B' : '#1C1C26'}`,
                    borderRadius: 20,
                    color: mode === m ? '#050507' : '#9898B4',
                    fontFamily: 'Inter',
                    fontSize: 13,
                    fontWeight: mode === m ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── ACTION BUTTONS — always visible, never hidden by tab bar ── */}
        <div style={{
          flexShrink: 0,
          padding: '12px 24px 16px',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          display: 'flex',
          gap: 12,
          background: '#0D0D13',
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              height: 50,
              background: '#121219',
              border: '1px solid #1C1C26',
              borderRadius: 12,
              color: '#9898B4',
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            style={{
              flex: 2,
              height: 50,
              background: canSave ? '#F2D06B' : '#2E2E3E',
              border: 'none',
              borderRadius: 12,
              color: canSave ? '#050507' : '#9898B4',
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: 14,
              cursor: canSave ? 'pointer' : 'not-allowed',
            }}
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}
