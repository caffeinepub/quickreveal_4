import React from 'react';
import { MapPin } from 'lucide-react';

interface RadiusSimulatorProps {
  value: number;
  onChange: (value: number) => void;
}

const RadiusSimulator: React.FC<RadiusSimulatorProps> = ({ value, onChange }) => {
  const maxRadius = 50;
  const circleSize = (value / maxRadius) * 200;

  return (
    <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px' }}>
      {/* Visual Representation */}
      <div
        style={{
          width: '240px',
          height: '240px',
          margin: '0 auto 24px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '50%',
        }}
      >
        {/* Expanding Circle */}
        <div
          style={{
            width: `${circleSize}px`,
            height: `${circleSize}px`,
            borderRadius: '50%',
            background: 'rgba(232, 213, 176, 0.1)',
            border: '2px solid rgba(232, 213, 176, 0.4)',
            position: 'absolute',
            transition: 'all 300ms ease-out',
          }}
        />
        
        {/* Center Pin */}
        <div
          style={{
            position: 'absolute',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <MapPin size={32} style={{ color: '#E8D5B0' }} />
          <div
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#E8D5B0',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            {value} km
          </div>
        </div>
      </div>

      {/* Slider Control */}
      <div style={{ marginBottom: '12px' }}>
        <input
          type="range"
          min="0"
          max={maxRadius}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            background: `linear-gradient(to right, #E8D5B0 0%, #E8D5B0 ${(value / maxRadius) * 100}%, rgba(255, 255, 255, 0.1) ${(value / maxRadius) * 100}%, rgba(255, 255, 255, 0.1) 100%)`,
            outline: 'none',
            cursor: 'pointer',
            appearance: 'none',
            WebkitAppearance: 'none',
          }}
        />
      </div>

      {/* Value Display */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255, 255, 255, 0.35)' }}>
        <span>0 km</span>
        <span style={{ color: '#E8D5B0', fontWeight: 700 }}>Rayon: {value} km</span>
        <span>{maxRadius} km</span>
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #E8D5B0;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(232, 213, 176, 0.4);
          transition: all 300ms;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(232, 213, 176, 0.6);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #E8D5B0;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(232, 213, 176, 0.4);
          transition: all 300ms;
        }
        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(232, 213, 176, 0.6);
        }
      `}</style>
    </div>
  );
};

export default RadiusSimulator;
