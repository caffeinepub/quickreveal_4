import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Check, X, TrendingUp, Clock, Share2, Edit } from 'lucide-react';

const NexusOS: React.FC = () => {
  const {
    goToSplash,
    goToExplorer,
    goToBuilder,
    logoutPro,
    bookingRequests,
    acceptBookingRequest,
    refuseBookingRequest,
    selectedProvider,
    toggleAgendaSlot,
    publishedStudio,
    activeNexusTab,
    setActiveNexusTab,
    currentAgendaWeekOffset,
    setCurrentAgendaWeekOffset,
  } = useAppContext();

  const [fadingOutId, setFadingOutId] = useState<string | null>(null);

  const pendingRequests = bookingRequests.filter((r) => r.status === 'pending');
  const acceptedCount = bookingRequests.filter((r) => r.status === 'accepted').length;

  const handleRefuse = (id: string) => {
    setFadingOutId(id);
    setTimeout(() => {
      refuseBookingRequest(id);
      setFadingOutId(null);
    }, 300);
  };

  // Generate weekly agenda slots
  const generateWeekDays = (offset: number) => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const dates: Date[] = [];
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1 + offset * 7);

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates.map((date, idx) => ({
      label: days[idx],
      date,
      dateStr: date.toISOString().split('T')[0],
      dayNum: date.getDate(),
    }));
  };

  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 9; hour <= 19; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  const weekDays = generateWeekDays(currentAgendaWeekOffset);
  const timeSlots = generateTimeSlots();

  const isSlotBlocked = (dateStr: string, time: string) => {
    if (!selectedProvider) return false;
    const blockedSlots = selectedProvider.blockedSlots || [];
    return blockedSlots.some((slot) => slot.date === dateStr && slot.time === time);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleDateString('fr-FR', { month: 'short' });
    return `${day} ${month}`;
  };

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {/* Header */}
      <div
        style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.09)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          onClick={goToSplash}
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '22px',
            fontWeight: 900,
            letterSpacing: '-0.5px',
            cursor: 'pointer',
          }}
        >
          NEXUS<span style={{ color: '#6b7dff' }}>.</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={goToExplorer}
            style={{
              background: '#1a1a1a',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '999px',
              color: '#ffffff',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '8px 16px',
              cursor: 'pointer',
            }}
          >
            ⇄ MODE CLIENT
          </button>
          <button
            onClick={logoutPro}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '999px',
              color: 'rgba(255, 255, 255, 0.55)',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '8px 16px',
              cursor: 'pointer',
            }}
          >
            DÉCONNEXION
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          padding: '20px',
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.09)',
          overflowX: 'auto',
        }}
      >
        {[
          { id: 'radar', label: 'RADAR', count: pendingRequests.length },
          { id: 'wallet', label: 'WALLET' },
          { id: 'portfolio', label: 'PORTFOLIO' },
          { id: 'agenda', label: 'AGENDA' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveNexusTab(tab.id as any)}
            style={{
              background: activeNexusTab === tab.id ? 'rgba(232,213,176,0.12)' : 'transparent',
              border: `1px solid ${activeNexusTab === tab.id ? '#E8D5B0' : 'rgba(255, 255, 255, 0.09)'}`,
              borderRadius: '999px',
              color: activeNexusTab === tab.id ? '#E8D5B0' : 'rgba(255, 255, 255, 0.55)',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '8px 16px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span
                style={{
                  background: '#E8D5B0',
                  color: '#0a0a0a',
                  borderRadius: '999px',
                  padding: '2px 6px',
                  fontSize: '10px',
                  fontWeight: 900,
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {/* RADAR TAB */}
        {activeNexusTab === 'radar' && (
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'rgba(255, 255, 255, 0.55)',
                marginBottom: '16px',
              }}
            >
              DEMANDES ENTRANTES · {acceptedCount} ACCEPTÉES
            </div>

            {pendingRequests.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '80px 20px',
                }}
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(34, 197, 94, 0.12)',
                    border: '2px solid rgba(34, 197, 94, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <Check size={40} color="#22c55e" />
                </div>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: 'rgba(255, 255, 255, 0.55)',
                  }}
                >
                  TOUT EST CALME
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    style={{
                      background: '#1a1a1a',
                      border: `2px solid ${req.status === 'accepted' ? '#22c55e' : 'rgba(255, 255, 255, 0.09)'}`,
                      borderRadius: '16px',
                      padding: '18px',
                      opacity: fadingOutId === req.id ? 0 : 1,
                      transition: 'opacity 0.3s ease-out',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '14px', marginBottom: '12px' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: '#E8D5B0',
                          color: '#0a0a0a',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          fontWeight: 900,
                          flexShrink: 0,
                        }}
                      >
                        {getInitials(req.clientName)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '2px' }}>
                          {req.clientName}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.55)',
                          }}
                        >
                          {req.location} · {formatDate(req.date)} à {req.time}
                        </div>
                      </div>
                      <div
                        style={{
                          fontFamily: 'Playfair Display, Georgia, serif',
                          fontSize: '22px',
                          fontWeight: 800,
                          color: '#E8D5B0',
                          flexShrink: 0,
                        }}
                      >
                        {req.price}.–
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        marginBottom: '14px',
                        paddingLeft: '62px',
                      }}
                    >
                      {req.service}
                    </div>
                    {req.status === 'accepted' ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 16px',
                          background: 'rgba(34, 197, 94, 0.12)',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                          borderRadius: '10px',
                          color: '#22c55e',
                          fontSize: '13px',
                          fontWeight: 700,
                        }}
                      >
                        <Check size={16} />
                        ACCEPTÉ
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleRefuse(req.id)}
                          style={{
                            flex: 1,
                            background: '#1a1a1a',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '10px',
                            padding: '12px',
                            color: 'rgba(255, 255, 255, 0.55)',
                            fontSize: '12px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                          }}
                        >
                          <X size={16} />
                          REFUSER
                        </button>
                        <button
                          onClick={() => acceptBookingRequest(req.id)}
                          className="btn-sand"
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                          }}
                        >
                          <Check size={16} />
                          ACCEPTER
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* WALLET TAB */}
        {activeNexusTab === 'wallet' && (
          <div>
            {/* Balance Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                borderRadius: '20px',
                padding: '28px',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'rgba(255, 255, 255, 0.55)',
                  marginBottom: '12px',
                }}
              >
                SOLDE TOTAL
                <TrendingUp size={14} />
              </div>
              <div
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '52px',
                  fontWeight: 900,
                  letterSpacing: '-2px',
                  marginBottom: '20px',
                }}
              >
                245.–
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  style={{
                    flex: 1,
                    background: '#E8D5B0',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px',
                    color: '#0a0a0a',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                  }}
                >
                  VIREMENT
                </button>
                <button
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    padding: '12px',
                    color: 'rgba(255, 255, 255, 0.55)',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                  }}
                >
                  ANALYTICS
                </button>
              </div>
            </div>

            {/* Escrow Card */}
            <div
              style={{
                background: '#1a1a1a',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Clock size={20} color="rgba(255, 255, 255, 0.55)" />
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.55)',
                  }}
                >
                  En attente de prestation
                </div>
              </div>
              <div
                style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  fontSize: '28px',
                  fontWeight: 800,
                  color: '#E8D5B0',
                }}
              >
                60.–
              </div>
            </div>

            {/* Transaction History */}
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'rgba(255, 255, 255, 0.55)',
                marginBottom: '12px',
              }}
            >
              HISTORIQUE
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { name: 'Sarah L.', amount: 120 },
                { name: 'Marc D.', amount: 45 },
                { name: 'Sophie M.', amount: 80 },
              ].map((tx, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid rgba(255, 255, 255, 0.09)',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ fontSize: '15px', fontWeight: 600 }}>{tx.name}</div>
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#22c55e',
                    }}
                  >
                    +{tx.amount}.–
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PORTFOLIO TAB */}
        {activeNexusTab === 'portfolio' && (
          <div>
            {!publishedStudio ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '60px 20px',
                }}
              >
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>✨</div>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    marginBottom: '12px',
                    textAlign: 'center',
                  }}
                >
                  Créez votre studio professionnel
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.55)',
                    marginBottom: '28px',
                    textAlign: 'center',
                    maxWidth: '400px',
                  }}
                >
                  Configurez vos services, tarifs et disponibilités pour apparaître dans l'Explorer
                </div>
                <button onClick={goToBuilder} className="btn-sand">
                  CRÉER MON STUDIO
                </button>
              </div>
            ) : (
              <div>
                {/* Studio Cover */}
                <div
                  style={{
                    height: '200px',
                    borderRadius: '20px',
                    background: `linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)`,
                    backgroundImage: `url(${publishedStudio.coverPhotoUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    marginBottom: '20px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '20px',
                      left: '20px',
                      fontSize: '28px',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: '-0.5px',
                    }}
                  >
                    {publishedStudio.name}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                  <button
                    onClick={goToBuilder}
                    style={{
                      flex: 1,
                      background: '#1a1a1a',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      padding: '12px',
                      color: 'rgba(255, 255, 255, 0.55)',
                      fontSize: '12px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <Edit size={14} />
                    MODIFIER
                  </button>
                  <button
                    style={{
                      flex: 1,
                      background: '#E8D5B0',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px',
                      color: '#0a0a0a',
                      fontSize: '12px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <Share2 size={14} />
                    PARTAGER
                  </button>
                </div>

                {/* Services List */}
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'rgba(255, 255, 255, 0.55)',
                    marginBottom: '12px',
                  }}
                >
                  PRESTATIONS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {publishedStudio.services.map((service, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#1a1a1a',
                        border: '1px solid rgba(255, 255, 255, 0.09)',
                        borderRadius: '12px',
                        padding: '16px',
                      }}
                    >
                      <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>
                        {service.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)' }}>
                        {service.duration}
                        {service.priceDomicile && ` · 🏠 ${service.priceDomicile}.–`}
                        {service.priceStudio && ` · ✂️ ${service.priceStudio}.–`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* AGENDA TAB */}
        {activeNexusTab === 'agenda' && (
          <div>
            {/* Week Navigation */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <button
                onClick={() => setCurrentAgendaWeekOffset(currentAgendaWeekOffset - 1)}
                style={{
                  background: '#1a1a1a',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  color: 'rgba(255, 255, 255, 0.55)',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                ← Semaine précédente
              </button>
              <button
                onClick={() => setCurrentAgendaWeekOffset(currentAgendaWeekOffset + 1)}
                style={{
                  background: '#1a1a1a',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  color: 'rgba(255, 255, 255, 0.55)',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Semaine suivante →
              </button>
            </div>

            {/* Calendar Grid */}
            <div style={{ overflowX: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', gap: '8px', minWidth: '800px' }}>
                {/* Header */}
                <div />
                {weekDays.map((day) => (
                  <div
                    key={day.dateStr}
                    style={{
                      textAlign: 'center',
                      padding: '12px 8px',
                      background: '#1a1a1a',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.09)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'rgba(255, 255, 255, 0.55)',
                        marginBottom: '4px',
                      }}
                    >
                      {day.label}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 700 }}>{day.dayNum}</div>
                  </div>
                ))}

                {/* Time Slots */}
                {timeSlots.map((time) => (
                  <React.Fragment key={time}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: 'rgba(255, 255, 255, 0.55)',
                        paddingRight: '8px',
                      }}
                    >
                      {time}
                    </div>
                    {weekDays.map((day) => {
                      const blocked = isSlotBlocked(day.dateStr, time);
                      return (
                        <div
                          key={`${day.dateStr}-${time}`}
                          onClick={() => toggleAgendaSlot(day.dateStr, time)}
                          style={{
                            background: blocked
                              ? 'rgba(239, 68, 68, 0.15)'
                              : 'rgba(232, 213, 176, 0.08)',
                            border: `1px solid ${blocked ? 'rgba(239, 68, 68, 0.3)' : 'rgba(232, 213, 176, 0.2)'}`,
                            borderRadius: '8px',
                            padding: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.18s',
                            minHeight: '48px',
                          }}
                        />
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div
              style={{
                marginTop: '20px',
                padding: '16px',
                background: 'rgba(232,213,176,0.08)',
                border: '1px solid rgba(232,213,176,0.2)',
                borderRadius: '10px',
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.55)',
              }}
            >
              <strong style={{ color: '#E8D5B0' }}>Légende :</strong> Cliquez sur un créneau pour le
              bloquer (rouge) ou le débloquer (sand). Les créneaux bloqués n'apparaîtront pas dans le
              booking client.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NexusOS;
