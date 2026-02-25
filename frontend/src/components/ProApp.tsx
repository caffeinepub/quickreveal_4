import { useState, useEffect, useRef, useCallback } from 'react'

// ━━━ COULEURS ━━━
const C = {
  void:  '#050507',
  d1:    '#09090D',
  d2:    '#0D0D13',
  d3:    '#121219',
  d4:    '#1C1C26',
  d5:    '#2E2E3E',
  gold:  '#F2D06B',
  t1:    '#F4F4F8',
  t2:    '#9898B4',
  t3:    '#54546C',
  t4:    '#2E2E3E',
  flash: '#00D97A',
  alert: '#FF3D5A',
}

// ━━━ NAVIGATION ━━━
type ProView =
  | 'dashboard'
  | 'radar'
  | 'wallet'
  | 'business'
  | 'modal'
  | 'success'

// ━━━ ÉTAT GLOBAL PRO ━━━
interface ProState {
  view: ProView
  prevView: ProView
  proActif: boolean
  flashActif: boolean
  businessTab: 'identite' | 'paiement' | 'services' | 'galerie'
  photos: (string | null)[]
  iban: string
  prenom: string
  ville: string
  solde: number
  sequestre: number
  virementAt: number | null
}

const INITIAL_STATE: ProState = {
  view: 'dashboard',
  prevView: 'dashboard',
  proActif: false,
  flashActif: false,
  businessTab: 'identite',
  photos: [null, null, null, null],
  iban: '',
  prenom: 'Alexandre',
  ville: 'Lausanne',
  solde: 240,
  sequestre: 55,
  virementAt: null,
}

// ━━━ COMPOSANT RACINE ━━━
export default function ProApp() {
  const [s, setS] = useState<ProState>(INITIAL_STATE)

  const go = useCallback((view: ProView) => {
    setS(prev => ({ ...prev, prevView: prev.view, view }))
  }, [])

  const update = useCallback((patch: Partial<ProState>) => {
    setS(prev => ({ ...prev, ...patch }))
  }, [])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: C.void,
      fontFamily: 'Inter, sans-serif',
      maxWidth: 430,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>

      {/* CONTENT AREA */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch' as any,
        position: 'relative',
      }}>
        {s.view === 'dashboard' && (
          <Dashboard s={s} update={update} go={go} />
        )}
        {s.view === 'radar' && (
          <Radar s={s} update={update} />
        )}
        {s.view === 'wallet' && (
          <Wallet s={s} update={update} />
        )}
        {s.view === 'business' && (
          <Business s={s} update={update} go={go} />
        )}
      </div>

      {/* MODAL — par dessus tout */}
      {s.view === 'modal' && (
        <Modal
          onClose={() => go(s.prevView)}
          onStart={() => go('success')}
        />
      )}

      {/* SUCCESS — par dessus tout */}
      {s.view === 'success' && (
        <Success
          onDone={() => {
            update({
              proActif: true,
              view: 'dashboard',
              prevView: 'success',
            })
          }}
        />
      )}

      {/* TAB BAR — masquée pendant modal/success */}
      {s.view !== 'modal' && s.view !== 'success' && (
        <TabBar
          active={s.view as string}
          onChange={(v: string) => go(v as ProView)}
        />
      )}
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TAB BAR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function TabBar({ active, onChange }: { active: string; onChange: (v: string) => void }) {
  const tabs = [
    { id: 'radar',     label: 'Radar',     icon: IconRadar },
    { id: 'wallet',    label: 'Wallet',    icon: IconWallet },
    { id: 'dashboard', label: 'Dashboard', icon: IconDashboard },
    { id: 'business',  label: 'Business',  icon: IconBusiness },
  ]

  return (
    <div style={{
      display: 'flex',
      background: 'rgba(5,5,7,0.97)',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      flexShrink: 0,
    }}>
      {tabs.map(tab => {
        const isActive = active === tab.id
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 0 8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              gap: 4,
            }}
          >
            {isActive && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 20,
                height: 2,
                background: C.gold,
                borderRadius: 2,
              }} />
            )}
            <Icon size={22} color={isActive ? C.gold : C.t4} />
            <span style={{
              fontSize: 10,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? C.gold : C.t4,
              fontFamily: 'Inter',
            }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MODAL ABONNEMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Modal({ onClose, onStart }: { onClose: () => void; onStart: () => void }) {
  const [loading, setLoading] = useState(false)

  const handleStart = () => {
    if (loading) return
    setLoading(true)
    setTimeout(() => { onStart() }, 600)
  }

  const avantages = [
    'Profil visible par des milliers de clients',
    'Reservations instantanees 24h/24',
    'Paiements garantis via TWINT',
    'Notifications temps reel',
    'Zero commission les 7 premiers jours',
  ]

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5,5,7,0.92)',
        zIndex: 9000,
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          background: C.d2,
          borderRadius: '24px 24px 0 0',
          border: '1px solid rgba(242,208,107,0.15)',
          borderBottom: 'none',
          padding: '28px 24px',
          paddingBottom: 'calc(28px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 20,
        }}>
          <div>
            <p style={{
              fontFamily: 'Inter',
              fontWeight: 800,
              fontSize: 22,
              color: C.t1,
              margin: 0,
              letterSpacing: '-0.03em',
            }}>
              LANCER MON SERVICE
            </p>
            <p style={{
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: 14,
              color: C.gold,
              margin: '4px 0 0',
            }}>
              7 jours gratuits · Sans engagement
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: C.d3,
              border: 'none',
              borderRadius: 8,
              width: 32,
              height: 32,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: C.t3,
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        {/* Avantages */}
        <div style={{ marginBottom: 24 }}>
          {avantages.map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              marginBottom: 14,
            }}>
              <div style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: 'rgba(242,208,107,0.1)',
                border: '1px solid rgba(242,208,107,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <IconCheck size={11} color={C.gold} />
              </div>
              <span style={{
                fontFamily: 'Inter',
                fontWeight: 400,
                fontSize: 14,
                color: C.t2,
                lineHeight: 1.5,
                paddingTop: 2,
              }}>
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* BOUTON CRITIQUE */}
        <button
          onClick={handleStart}
          disabled={loading}
          style={{
            width: '100%',
            height: 56,
            borderRadius: 14,
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            background: loading ? C.d4 : C.gold,
            color: loading ? C.t3 : C.void,
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: '0.02em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 150ms',
          }}
        >
          {loading ? 'Activation...' : 'Commencer 7 jours gratuits'}
        </button>

        <p
          onClick={onClose}
          style={{
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: 13,
            color: C.t3,
            textAlign: 'center',
            marginTop: 14,
            cursor: 'pointer',
          }}
        >
          Pas maintenant
        </p>
      </div>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SUCCESS ANIMATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Success({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const [showCheck, setShowCheck] = useState(false)
  const alive = useRef(true)

  useEffect(() => {
    alive.current = true

    let p = 0
    const iv = setInterval(() => {
      if (!alive.current) return
      p += 2.5
      if (p >= 100) {
        p = 100
        clearInterval(iv)
        if (alive.current) setShowCheck(true)
      }
      setProgress(p)
    }, 50)

    const t = setTimeout(() => {
      if (alive.current) onDone()
    }, 3800)

    return () => {
      alive.current = false
      clearInterval(iv)
      clearTimeout(t)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: C.void,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>

      {/* Barre progression */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: C.d4,
      }}>
        <div style={{
          height: '100%',
          width: progress + '%',
          background: C.gold,
          transition: 'width 50ms linear',
          borderRadius: '0 2px 2px 0',
        }} />
      </div>

      {!showCheck && (
        <>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: `3px solid ${C.d4}`,
            borderTopColor: C.gold,
            animation: 'proSpin 1s linear infinite',
          }} />
          <p style={{
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: 15,
            color: C.t3,
            marginTop: 20,
          }}>
            Activation en cours...
          </p>
        </>
      )}

      {showCheck && (
        <>
          {/* Confetti or */}
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: (Math.random() * 90 + 5) + '%',
              top: '-8px',
              width: 5,
              height: 8,
              borderRadius: 2,
              background: C.gold,
              animation: `proFall ${900 + Math.random() * 700}ms ${Math.random() * 600}ms ease-in forwards`,
            }} />
          ))}

          <div style={{
            width: 76,
            height: 76,
            borderRadius: '50%',
            background: 'rgba(0,217,122,0.1)',
            border: `2px solid ${C.flash}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'proScale 400ms ease-out',
          }}>
            <IconCheck size={30} color={C.flash} />
          </div>

          <p style={{
            fontFamily: 'Inter',
            fontWeight: 800,
            fontSize: 26,
            color: C.t1,
            marginTop: 22,
            letterSpacing: '-0.03em',
          }}>
            Profil active !
          </p>
          <p style={{
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: 14,
            color: C.t2,
            marginTop: 8,
            textAlign: 'center',
            padding: '0 40px',
            lineHeight: 1.6,
          }}>
            Vous etes visible par les clients de votre zone.
          </p>
        </>
      )}

      <style>{`
        @keyframes proSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes proScale {
          from { transform: scale(0.4); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes proFall {
          from { transform: translateY(0) rotate(0deg); opacity: 1; }
          to   { transform: translateY(100vh) rotate(540deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DASHBOARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Dashboard({ s, update, go }: { s: ProState; update: (p: Partial<ProState>) => void; go: (v: ProView) => void }) {
  return (
    <div style={{
      padding: '24px 20px 100px',
      background: C.void,
      minHeight: '100%',
    }}>
      <p style={{
        fontFamily: 'Inter',
        fontWeight: 800,
        fontSize: 28,
        color: C.t1,
        letterSpacing: '-0.04em',
        margin: 0,
      }}>
        Bonjour {s.prenom}
      </p>
      <p style={{
        fontFamily: 'Inter',
        fontWeight: 400,
        fontSize: 14,
        color: C.t3,
        marginTop: 4,
      }}>
        Espace professionnel · {s.ville}
      </p>

      {/* Badge actif */}
      {s.proActif && (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(0,217,122,0.08)',
          border: '1px solid rgba(0,217,122,0.2)',
          borderRadius: 999,
          padding: '5px 12px',
          marginTop: 12,
        }}>
          <div style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: C.flash,
          }} />
          <span style={{
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: 11,
            color: C.flash,
          }}>
            ESSAI GRATUIT · J1/7
          </span>
        </div>
      )}

      {/* Métriques */}
      <div style={{
        display: 'flex',
        gap: 12,
        marginTop: 24,
        overflowX: 'auto',
        paddingBottom: 4,
      }}>
        {[
          { label: 'RESERVATIONS', value: '12',      color: '#5B7FFF' },
          { label: 'CE MOIS',      value: '480 CHF',  color: C.gold },
          { label: 'NOTE',         value: '4.9',      color: C.flash },
        ].map((m, i) => (
          <div key={i} style={{
            minWidth: 140,
            background: C.d2,
            border: `1px solid ${m.color}22`,
            borderRadius: 18,
            padding: 18,
            flexShrink: 0,
          }}>
            <p style={{
              fontFamily: 'Inter',
              fontWeight: 900,
              fontSize: 28,
              color: C.t1,
              margin: 0,
              letterSpacing: '-0.04em',
            }}>
              {m.value}
            </p>
            <p style={{
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 10,
              color: m.color,
              margin: '4px 0 0',
              letterSpacing: '0.1em',
            }}>
              {m.label}
            </p>
          </div>
        ))}
      </div>

      {/* Flash toggle */}
      <div
        onClick={() => update({ flashActif: !s.flashActif })}
        style={{
          marginTop: 20,
          background: s.flashActif ? 'rgba(0,217,122,0.04)' : C.d2,
          border: `1px solid ${s.flashActif ? 'rgba(0,217,122,0.2)' : 'rgba(255,255,255,0.04)'}`,
          borderRadius: 18,
          padding: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
      >
        <div>
          <p style={{
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: 15,
            color: s.flashActif ? C.flash : C.t3,
            margin: 0,
          }}>
            {s.flashActif ? 'Disponible maintenant' : 'Mode Flash desactive'}
          </p>
          <p style={{
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: 13,
            color: C.t3,
            margin: '4px 0 0',
          }}>
            {s.flashActif ? 'Les clients vous voient' : 'Activez pour recevoir des demandes'}
          </p>
        </div>
        <div style={{
          width: 48,
          height: 28,
          borderRadius: 999,
          background: s.flashActif ? C.flash : C.d4,
          position: 'relative',
          transition: 'background 200ms',
          flexShrink: 0,
        }}>
          <div style={{
            position: 'absolute',
            top: 3,
            left: s.flashActif ? 23 : 3,
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: 'white',
            transition: 'left 200ms',
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }} />
        </div>
      </div>

      {/* CTA si pas actif */}
      {!s.proActif && (
        <button
          onClick={() => go('modal')}
          style={{
            width: '100%',
            height: 56,
            marginTop: 20,
            borderRadius: 14,
            border: 'none',
            background: C.gold,
            color: C.void,
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
            letterSpacing: '0.02em',
          }}
        >
          Activer mon profil
        </button>
      )}
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RADAR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Radar({ s, update }: { s: ProState; update: (p: Partial<ProState>) => void }) {
  const [demandes, setDemandes] = useState([
    { id: 1, prenom: 'Thomas', nom: 'M.', note: 4.9, distance: 0.8, service: 'Coupe + Barbe',     montant: 55, expires: 228 },
    { id: 2, prenom: 'Lucas',  nom: 'B.', note: 4.7, distance: 1.2, service: 'Degrade premium',   montant: 45, expires: 408 },
  ])

  useEffect(() => {
    const iv = setInterval(() => {
      setDemandes(prev => prev.map(d => ({
        ...d,
        expires: Math.max(0, d.expires - 1),
      })))
    }, 1000)
    return () => clearInterval(iv)
  }, [])

  const fmt = (secs: number) => {
    const m = Math.floor(secs / 60)
    const sec = secs % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div style={{ padding: '24px 20px 100px', minHeight: '100%' }}>
      <p style={{
        fontFamily: 'Inter',
        fontWeight: 900,
        fontSize: 36,
        color: C.t1,
        letterSpacing: '-0.05em',
        margin: 0,
      }}>
        RADAR
      </p>
      <p style={{
        fontFamily: 'Inter',
        fontWeight: 400,
        fontSize: 14,
        color: C.t3,
        marginTop: 4,
      }}>
        Demandes en attente
      </p>

      {demandes.map(d => (
        <div key={d.id} style={{
          marginTop: 16,
          background: C.d2,
          border: '1px solid rgba(255,61,90,0.2)',
          borderRadius: 20,
          overflow: 'hidden',
        }}>
          <div style={{
            background: 'rgba(255,61,90,0.05)',
            padding: '12px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 10,
              color: C.t3,
              letterSpacing: '0.1em',
            }}>
              EXPIRE DANS
            </span>
            <span style={{
              fontFamily: 'Inter',
              fontWeight: 900,
              fontSize: 22,
              color: d.expires < 120 ? C.alert : C.t1,
            }}>
              {fmt(d.expires)}
            </span>
          </div>

          <div style={{ padding: '16px 18px' }}>
            <p style={{
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: 16,
              color: C.t1,
              margin: 0,
            }}>
              {d.prenom} {d.nom}
            </p>
            <p style={{
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: 13,
              color: C.t3,
              margin: '2px 0 8px',
            }}>
              {d.service} · {d.distance}km
            </p>
            <p style={{
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: 20,
              color: C.gold,
              margin: 0,
            }}>
              {d.montant} CHF
            </p>

            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button
                onClick={() => setDemandes(prev => prev.filter(x => x.id !== d.id))}
                style={{
                  flex: 1,
                  height: 50,
                  borderRadius: 12,
                  border: '1px solid rgba(255,61,90,0.3)',
                  background: 'transparent',
                  color: C.alert,
                  fontFamily: 'Inter',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Decliner
              </button>
              <button
                onClick={() => setDemandes(prev => prev.filter(x => x.id !== d.id))}
                style={{
                  flex: 1,
                  height: 50,
                  borderRadius: 12,
                  border: 'none',
                  background: C.flash,
                  color: C.void,
                  fontFamily: 'Inter',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Accepter
              </button>
            </div>
          </div>
        </div>
      ))}

      {demandes.length === 0 && (
        <div style={{ marginTop: 60, textAlign: 'center' }}>
          <p style={{
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: 16,
            color: C.t3,
          }}>
            Aucune demande en cours
          </p>
          <p style={{
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: 14,
            color: C.t3,
            marginTop: 8,
          }}>
            Activez le mode Flash pour recevoir des demandes
          </p>
        </div>
      )}
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WALLET
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Wallet({ s, update }: { s: ProState; update: (p: Partial<ProState>) => void }) {
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (!s.virementAt) return
    const iv = setInterval(() => {
      const elapsed = (Date.now() - s.virementAt!) / 1000
      const remaining = Math.max(0, 30 - elapsed)
      setCooldown(Math.ceil(remaining))
      if (remaining <= 0) {
        update({ virementAt: null })
        clearInterval(iv)
      }
    }, 1000)
    return () => clearInterval(iv)
  }, [s.virementAt]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleVirement = () => {
    if (s.virementAt) return
    update({ solde: 0, virementAt: Date.now() })
  }

  const isCooldown = !!s.virementAt

  return (
    <div style={{ padding: '24px 20px 100px', minHeight: '100%' }}>

      {/* Card solde */}
      <div style={{
        background: 'linear-gradient(145deg,#0A0A0A,#0F0E0A)',
        border: '1px solid rgba(242,208,107,0.12)',
        borderRadius: 24,
        padding: '28px 24px',
      }}>
        <p style={{
          fontFamily: 'Inter',
          fontWeight: 600,
          fontSize: 10,
          color: C.t3,
          margin: 0,
          letterSpacing: '0.15em',
        }}>
          SOLDE DISPONIBLE
        </p>
        <p style={{
          fontFamily: 'Inter',
          fontWeight: 900,
          fontSize: 48,
          color: C.t1,
          margin: '6px 0 0',
          letterSpacing: '-0.05em',
        }}>
          {s.solde} CHF
        </p>
        <p style={{
          fontFamily: 'Inter',
          fontWeight: 400,
          fontSize: 12,
          color: C.t3,
          margin: '6px 0 20px',
        }}>
          {s.sequestre} CHF en sequestre · Libere dans 48h
        </p>

        <button
          onClick={handleVirement}
          disabled={isCooldown}
          style={{
            width: '100%',
            height: 50,
            borderRadius: 12,
            border: 'none',
            background: isCooldown ? C.d4 : C.gold,
            color: isCooldown ? C.t3 : C.void,
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: 14,
            cursor: isCooldown ? 'not-allowed' : 'pointer',
            transition: 'all 200ms',
          }}
        >
          {isCooldown ? `Virement initie (${cooldown}s)` : 'Virer sur mon compte'}
        </button>
      </div>

      {/* Historique */}
      <p style={{
        fontFamily: 'Inter',
        fontWeight: 700,
        fontSize: 16,
        color: C.t1,
        marginTop: 28,
        marginBottom: 4,
      }}>
        Historique
      </p>

      {[
        { nom: 'Thomas M.',    montant: 55,  type: 'entree', date: "Aujourd hui 10:00" },
        { nom: 'Lucas B.',     montant: 45,  type: 'entree', date: "Aujourd hui 13:30" },
        { nom: 'Antoine R.',   montant: 40,  type: 'entree', date: 'Hier 16:00' },
        { nom: 'Virement IBAN', montant: -65, type: 'sortie', date: 'Lun 09:00' },
      ].map((t, i) => (
        <div key={i} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '14px 0',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: t.type === 'entree' ? 'rgba(0,217,122,0.1)' : 'rgba(255,61,90,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{
              fontSize: 16,
              color: t.type === 'entree' ? C.flash : C.alert,
            }}>
              {t.type === 'entree' ? '↓' : '↑'}
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 14,
              color: C.t1,
              margin: 0,
            }}>
              {t.nom}
            </p>
            <p style={{
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: 12,
              color: C.t3,
              margin: '2px 0 0',
            }}>
              {t.date}
            </p>
          </div>
          <p style={{
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: 15,
            color: t.type === 'entree' ? C.flash : C.alert,
            margin: 0,
          }}>
            {t.type === 'entree' ? '+' : ''}{t.montant} CHF
          </p>
        </div>
      ))}
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BUSINESS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Business({ s, update, go }: { s: ProState; update: (p: Partial<ProState>) => void; go: (v: ProView) => void }) {
  const fileRef0 = useRef<HTMLInputElement>(null)
  const fileRef1 = useRef<HTMLInputElement>(null)
  const fileRef2 = useRef<HTMLInputElement>(null)
  const fileRef3 = useRef<HTMLInputElement>(null)
  const fileRefs = [fileRef0, fileRef1, fileRef2, fileRef3]

  const handleFile = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const p = [...s.photos]
      p[i] = ev.target?.result as string
      update({ photos: p })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const photoCount = s.photos.filter(Boolean).length

  const tabs = ['identite', 'paiement', 'services', 'galerie']
  const tabLabels = ['Identite', 'Paiement', 'Services', 'Galerie']

  return (
    <div style={{ padding: '24px 20px 100px', minHeight: '100%' }}>
      <p style={{
        fontFamily: 'Inter',
        fontWeight: 700,
        fontSize: 22,
        color: C.t1,
        margin: 0,
        letterSpacing: '-0.03em',
      }}>
        Mon Business
      </p>
      <p style={{
        fontFamily: 'Inter',
        fontWeight: 400,
        fontSize: 13,
        color: C.t3,
        marginTop: 4,
      }}>
        Configurez votre profil professionnel
      </p>

      {/* Sub-tabs */}
      <div style={{
        display: 'flex',
        gap: 0,
        marginTop: 20,
        marginBottom: 24,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => update({ businessTab: t as ProState['businessTab'] })}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              borderBottom: s.businessTab === t ? `2px solid ${C.gold}` : '2px solid transparent',
              padding: '8px 4px 12px',
              fontFamily: 'Inter',
              fontWeight: s.businessTab === t ? 600 : 400,
              fontSize: 12,
              color: s.businessTab === t ? C.t1 : C.t3,
              cursor: 'pointer',
              transition: 'all 150ms',
            }}
          >
            {tabLabels[i]}
          </button>
        ))}
      </div>

      {/* IDENTITE */}
      {s.businessTab === 'identite' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {['Prenom', 'Nom', 'Slogan', 'Ville'].map(label => (
            <div key={label}>
              <p style={{
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: 11,
                color: C.t3,
                margin: '0 0 6px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                {label}
              </p>
              <input
                style={{
                  width: '100%',
                  height: 50,
                  background: C.d3,
                  border: `1px solid ${C.d4}`,
                  borderRadius: 12,
                  padding: '0 16px',
                  fontFamily: 'Inter',
                  fontWeight: 500,
                  fontSize: 15,
                  color: C.t1,
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
                onFocus={e => { e.target.style.borderColor = C.gold }}
                onBlur={e => { e.target.style.borderColor = C.d4 }}
                placeholder={label}
              />
            </div>
          ))}
        </div>
      )}

      {/* PAIEMENT */}
      {s.businessTab === 'paiement' && (
        <div>
          <div style={{
            background: C.d3,
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14,
            padding: 16,
            marginBottom: 20,
          }}>
            <p style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 14,
              color: C.t2,
              margin: 0,
              lineHeight: 1.5,
            }}>
              Renseignez votre IBAN suisse pour recevoir vos paiements via TWINT.
            </p>
          </div>
          <p style={{
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: 11,
            color: C.t3,
            margin: '0 0 6px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            IBAN suisse
          </p>
          <input
            value={s.iban}
            onChange={e => update({ iban: e.target.value })}
            placeholder="CH__ ____ ____ ____ ____ _"
            style={{
              width: '100%',
              height: 50,
              background: C.d3,
              border: `1px solid ${s.iban.length > 5 ? C.flash : C.d4}`,
              borderRadius: 12,
              padding: '0 16px',
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 15,
              color: C.t1,
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
          {s.iban.length > 5 && (
            <p style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 12,
              color: C.flash,
              marginTop: 6,
            }}>
              IBAN enregistre
            </p>
          )}
        </div>
      )}

      {/* SERVICES */}
      {s.businessTab === 'services' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { nom: 'Coupe homme',          prix: 35, duree: '30min', badge: 'Populaire' },
            { nom: 'Degrade premium',      prix: 45, duree: '45min', badge: 'Populaire' },
            { nom: 'Coupe + Barbe',        prix: 55, duree: '60min', badge: null },
            { nom: 'Barbe design',         prix: 30, duree: '30min', badge: null },
            { nom: 'Rasage traditionnel',  prix: 40, duree: '45min', badge: 'Nouveau' },
          ].map((sv, i) => (
            <div key={i} style={{
              background: C.d3,
              border: `1px solid ${C.d4}`,
              borderRadius: 14,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <p style={{
                    fontFamily: 'Inter',
                    fontWeight: 600,
                    fontSize: 14,
                    color: C.t1,
                    margin: 0,
                  }}>
                    {sv.nom}
                  </p>
                  {sv.badge && (
                    <span style={{
                      fontFamily: 'Inter',
                      fontWeight: 600,
                      fontSize: 10,
                      color: C.gold,
                      background: 'rgba(242,208,107,0.1)',
                      border: '1px solid rgba(242,208,107,0.2)',
                      borderRadius: 999,
                      padding: '2px 8px',
                    }}>
                      {sv.badge}
                    </span>
                  )}
                </div>
                <p style={{
                  fontFamily: 'Inter',
                  fontWeight: 400,
                  fontSize: 12,
                  color: C.t3,
                  margin: '3px 0 0',
                }}>
                  {sv.duree}
                </p>
              </div>
              <p style={{
                fontFamily: 'Inter',
                fontWeight: 700,
                fontSize: 16,
                color: C.gold,
                margin: 0,
              }}>
                {sv.prix} CHF
              </p>
            </div>
          ))}
        </div>
      )}

      {/* GALERIE */}
      {s.businessTab === 'galerie' && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 6,
          }}>
            <p style={{
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: 14,
              color: C.t1,
              margin: 0,
            }}>
              {photoCount}/4 photos
            </p>
            {photoCount >= 3 && (
              <span style={{
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: 11,
                color: C.flash,
              }}>
                Minimum atteint
              </span>
            )}
          </div>

          {/* Barre progression */}
          <div style={{
            height: 3,
            background: C.d4,
            borderRadius: 999,
            marginBottom: 16,
          }}>
            <div style={{
              height: '100%',
              width: (photoCount / 4 * 100) + '%',
              background: C.gold,
              borderRadius: 999,
              transition: 'width 300ms',
            }} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
          }}>
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                onClick={() => fileRefs[i].current?.click()}
                style={{
                  height: 150,
                  borderRadius: 14,
                  overflow: 'hidden',
                  border: s.photos[i] ? 'none' : '2px dashed rgba(242,208,107,0.3)',
                  background: s.photos[i] ? 'none' : C.d3,
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <input
                  ref={fileRefs[i]}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => handleFile(i, e)}
                />

                {s.photos[i] ? (
                  <>
                    <img
                      src={s.photos[i]!}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                      alt={`Photo ${i + 1}`}
                    />
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        const p = [...s.photos]
                        p[i] = null
                        update({ photos: p })
                      }}
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: 'rgba(5,5,7,0.85)',
                        border: 'none',
                        cursor: 'pointer',
                        color: C.t1,
                        fontSize: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <>
                    <IconCamera size={22} color={C.t4} />
                    <span style={{
                      fontFamily: 'Inter',
                      fontWeight: 500,
                      fontSize: 12,
                      color: C.t3,
                    }}>
                      Ajouter
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>

          {photoCount >= 3 && (
            <button
              onClick={() => go('modal')}
              style={{
                width: '100%',
                height: 54,
                marginTop: 20,
                borderRadius: 14,
                border: 'none',
                background: C.gold,
                color: C.void,
                fontFamily: 'Inter',
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
              }}
            >
              Activer mon profil
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SVG ICONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const IconRadar = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth="1.5" fill="none">
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="10" />
  </svg>
)

const IconWallet = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth="1.5" fill="none">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
)

const IconDashboard = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth="1.5" fill="none">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
)

const IconBusiness = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth="1.5" fill="none">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
)

const IconCheck = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth="2" fill="none">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const IconCamera = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth="1.5" fill="none">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
)
