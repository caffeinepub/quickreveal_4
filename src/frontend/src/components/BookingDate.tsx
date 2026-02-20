import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const BG_COLORS: Record<string, [string, string]> = {
  barber: ['#1a0f08', '#3d2000'],
  coiffure: ['#1a0818', '#3d1040'],
  esthetique: ['#180818', '#380838'],
  massage: ['#081218', '#103040'],
  onglerie: ['#1a1808', '#3d3000'],
};

interface DayInfo {
  date: Date;
  label: string;
  num: number;
  isPast: boolean;
}

const BookingDate: React.FC = () => {
  const {
    selectedProvider,
    selectedService,
    selectedLocation,
    setCurrentScreen,
    setSelectedDateTime,
  } = useAppContext();
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [tempTime, setTempTime] = useState<string | null>(null);

  if (!selectedProvider || !selectedService || !selectedLocation) {
    return null;
  }

  const bg = BG_COLORS[selectedProvider.category] || ['#1a1a1a', '#2a2a2a'];
  const now = new Date();

  // Generate next 4 days
  const generateDays = (): DayInfo[] => {
    const days: DayInfo[] = [];
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    for (let i = 0; i < 4; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      date.setHours(0, 0, 0, 0);
      const isPast = date < new Date(now.getFullYear(), now.getMonth(), now.getDate());
      days.push({
        date,
        label: i === 0 ? 'Auj' : i === 1 ? 'Dem' : dayNames[date.getDay()],
        num: date.getDate(),
        isPast,
      });
    }
    return days;
  };

  // Generate time slots
  const generateTimeSlots = (): Array<{ time: string; isPast: boolean }> => {
    const slots: Array<{ time: string; isPast: boolean }> = [];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const isToday = tempDate && tempDate.toDateString() === now.toDateString();

    for (let hour = 9; hour <= 19; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        let isPast = false;

        if (isToday) {
          if (hour < currentHour || (hour === currentHour && min <= currentMinute)) {
            isPast = true;
          }
        }

        // Check if slot is blocked by provider
        const blockedSlots = selectedProvider.blockedSlots || [];
        const dateStr = tempDate?.toISOString().split('T')[0] || '';
        const isBlocked = blockedSlots.some(
          (slot) => slot.date === dateStr && slot.time === timeStr
        );

        if (!isBlocked) {
          slots.push({ time: timeStr, isPast });
        }
      }
    }
    return slots;
  };

  const days = generateDays();
  const timeSlots = generateTimeSlots();

  const currentPrice =
    selectedLocation === 'domicile' ? selectedService.priceDomicile : selectedService.priceStudio;

  const handleContinue = () => {
    if (tempDate && tempTime) {
      setSelectedDateTime({ date: tempDate, time: tempTime });
      setCurrentScreen('bookingContact');
    }
  };

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {/* Hero */}
      <div
        style={{
          height: '220px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(160deg, ${bg[0]}, ${bg[1]})`,
            backgroundImage: `url(${selectedProvider.coverPhotoUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 80%)',
          }}
        />
        <div
          onClick={() => setCurrentScreen('bookingLocation')}
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            zIndex: 10,
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '16px',
            color: '#ffffff',
          }}
        >
          ‹
        </div>
        <div style={{ position: 'relative', zIndex: 1, padding: '16px 20px 20px' }}>
          <div
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '28px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.3px',
              marginBottom: '3px',
            }}
          >
            {selectedProvider.name}
          </div>
          <div
            style={{
              fontSize: '10px',
              color: 'rgba(255, 255, 255, 0.25)',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            DATE
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 20px 40px' }}>
        {/* Recap */}
        <div style={{ marginBottom: '24px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.55)' }}>
          {selectedService.name} · {selectedLocation === 'domicile' ? 'Domicile' : 'Studio'} ·{' '}
          {currentPrice}.–
        </div>

        <div
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '16px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'rgba(255, 255, 255, 0.55)',
            marginBottom: '16px',
          }}
        >
          JOUR
        </div>

        {/* Days */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            marginBottom: '24px',
          }}
        >
          {days.map((day, idx) => (
            <div
              key={idx}
              onClick={() => !day.isPast && setTempDate(day.date)}
              style={{
                background: tempDate?.getDate() === day.date.getDate() ? '#E8D5B0' : '#1a1a1a',
                border: `1px solid ${tempDate?.getDate() === day.date.getDate() ? '#E8D5B0' : 'rgba(255, 255, 255, 0.09)'}`,
                borderRadius: '10px',
                padding: '14px 8px',
                textAlign: 'center',
                cursor: day.isPast ? 'not-allowed' : 'pointer',
                transition: 'all 0.18s',
                opacity: day.isPast ? 0.3 : 1,
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color:
                    tempDate?.getDate() === day.date.getDate()
                      ? '#0a0a0a'
                      : 'rgba(255, 255, 255, 0.25)',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                {day.label}
              </span>
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  color: tempDate?.getDate() === day.date.getDate() ? '#0a0a0a' : '#ffffff',
                  display: 'block',
                }}
              >
                {day.num}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '16px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'rgba(255, 255, 255, 0.55)',
            marginBottom: '16px',
          }}
        >
          HEURE
        </div>

        {/* Time slots */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            marginBottom: '32px',
          }}
        >
          {timeSlots.map((slot) => (
            <div
              key={slot.time}
              onClick={() => !slot.isPast && setTempTime(slot.time)}
              style={{
                background: tempTime === slot.time ? '#ffffff' : '#1a1a1a',
                border: `1px solid ${tempTime === slot.time ? '#ffffff' : 'rgba(255, 255, 255, 0.09)'}`,
                borderRadius: '10px',
                padding: '16px 8px',
                textAlign: 'center',
                fontSize: '15px',
                fontWeight: 700,
                cursor: slot.isPast ? 'not-allowed' : 'pointer',
                transition: 'all 0.18s',
                color: tempTime === slot.time ? '#0a0a0a' : '#ffffff',
                opacity: slot.isPast ? 0.3 : 1,
              }}
            >
              {slot.time}
            </div>
          ))}
        </div>

        <button className="btn-white" onClick={handleContinue} disabled={!tempDate || !tempTime}>
          SUIVANT →
        </button>
      </div>
    </div>
  );
};

export default BookingDate;
