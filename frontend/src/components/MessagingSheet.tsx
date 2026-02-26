import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'client' | 'pro';
  time: string;
}

interface MessagingSheetProps {
  isOpen: boolean;
  onClose: () => void;
  proName?: string;
  clientName?: string;
}

const INITIAL_MESSAGES: Message[] = [
  { id: '1', sender: 'pro', text: 'Bonjour ! Votre réservation est confirmée pour demain à 14h.', time: '10:30' },
  { id: '2', sender: 'client', text: 'Parfait, merci ! Est-ce que je dois apporter quelque chose ?', time: '10:32' },
  { id: '3', sender: 'pro', text: 'Non, tout est prévu de notre côté. À demain !', time: '10:35' },
];

const CLIENT_REPLIES = [
  'Super, merci !',
  'D\'accord, je serai là.',
  'Parfait !',
  'Merci pour l\'info.',
];

export default function MessagingSheet({ isOpen, onClose, proName = 'Pro', clientName = 'Client' }: MessagingSheetProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'pro',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    // Simulate client reply
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: CLIENT_REPLIES[Math.floor(Math.random() * CLIENT_REPLIES.length)],
        sender: 'client',
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, reply]);
    }, 1500);
  };

  return (
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

        {/* Fixed header */}
        <div style={{
          padding: '0 24px 16px',
          flexShrink: 0,
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <p style={{
              fontFamily: 'Inter',
              fontWeight: 800,
              fontSize: 18,
              color: '#F4F4F8',
              margin: 0,
            }}>
              {clientName}
            </p>
            <p style={{
              fontFamily: 'Inter',
              fontSize: 12,
              color: '#9898B4',
              margin: '2px 0 0',
            }}>
              Réservation confirmée
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#1C1C26',
              border: 'none',
              borderRadius: 8,
              width: 32,
              height: 32,
              color: '#9898B4',
              fontSize: 16,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch' as any,
          padding: '16px 20px',
        }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.sender === 'pro' ? 'flex-end' : 'flex-start',
                marginBottom: 12,
              }}
            >
              <div style={{
                maxWidth: '75%',
                background: msg.sender === 'pro' ? '#F2D06B' : '#1C1C26',
                borderRadius: msg.sender === 'pro' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                padding: '10px 14px',
              }}>
                <p style={{
                  margin: 0,
                  fontFamily: 'Inter',
                  fontSize: 14,
                  color: msg.sender === 'pro' ? '#050507' : '#F4F4F8',
                  lineHeight: 1.4,
                }}>
                  {msg.text}
                </p>
                <p style={{
                  margin: '4px 0 0',
                  fontFamily: 'Inter',
                  fontSize: 10,
                  color: msg.sender === 'pro' ? 'rgba(5,5,7,0.5)' : '#9898B4',
                  textAlign: 'right',
                }}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area — always visible */}
        <div style={{
          flexShrink: 0,
          padding: '12px 20px 16px',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          display: 'flex',
          gap: 10,
          background: '#0D0D13',
        }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Écrire un message..."
            style={{
              flex: 1,
              background: '#121219',
              border: '1px solid #1C1C26',
              borderRadius: 12,
              padding: '12px 14px',
              color: '#F4F4F8',
              fontFamily: 'Inter',
              fontSize: 14,
              outline: 'none',
            }}
          />
          <button
            onClick={handleSend}
            style={{
              width: 48,
              height: 48,
              background: '#F2D06B',
              border: 'none',
              borderRadius: 12,
              color: '#050507',
              fontSize: 18,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
