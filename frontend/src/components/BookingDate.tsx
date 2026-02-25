import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const DAYS = ['Aujourd\'hui', 'Demain', 'Après-demain', 'Dans 3 jours'];
const TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'];

export default function BookingDate() {
  const { navigateTo } = useAppContext();
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState('');

  return (
    <div
      style={{
        height: '100%',
        background: 'var(--void)',
        overflowY: 'auto',
        padding: '20px',
      }}
    >
      <button
        onClick={() => navigateTo('explorer')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--t2)',
          fontSize: 14,
          marginBottom: 24,
        }}
      >
        <ArrowLeft size={16} />
        Retour
      </button>

      <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--t1)', marginBottom: 20 }}>
        Choisissez une date
      </h1>

      {/* Day pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {DAYS.map((day, i) => (
          <button
            key={day}
            onClick={() => setSelectedDay(i)}
            style={{
              flexShrink: 0,
              padding: '10px 16px',
              borderRadius: 14,
              border: selectedDay === i ? '1px solid var(--gold)' : '1px solid var(--d4)',
              background: selectedDay === i ? 'rgba(212,175,55,0.15)' : 'var(--d2)',
              color: selectedDay === i ? 'var(--gold)' : 'var(--t2)',
              fontSize: 13,
              fontWeight: selectedDay === i ? 700 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Time slots */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
          marginBottom: 24,
        }}
      >
        {TIME_SLOTS.map(time => (
          <button
            key={time}
            onClick={() => setSelectedTime(time)}
            style={{
              padding: '12px',
              borderRadius: 12,
              border: selectedTime === time ? '1px solid var(--gold)' : '1px solid var(--d4)',
              background: selectedTime === time ? 'rgba(212,175,55,0.15)' : 'var(--d2)',
              color: selectedTime === time ? 'var(--gold)' : 'var(--t2)',
              fontSize: 14,
              fontWeight: selectedTime === time ? 700 : 400,
              cursor: 'pointer',
            }}
          >
            {time}
          </button>
        ))}
      </div>

      <button
        onClick={() => navigateTo('bookingFlow')}
        disabled={!selectedTime}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: 16,
          background: selectedTime
            ? 'linear-gradient(135deg, var(--gold) 0%, #b8860b 100%)'
            : 'var(--d3)',
          border: 'none',
          color: selectedTime ? '#000' : 'var(--t3)',
          fontSize: 16,
          fontWeight: 800,
          cursor: selectedTime ? 'pointer' : 'not-allowed',
        }}
      >
        Continuer →
      </button>
    </div>
  );
}
