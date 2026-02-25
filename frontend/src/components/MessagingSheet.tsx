import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'client' | 'pro';
  time: string;
}

interface BookingLike {
  id: string;
  clientName?: string;
  service?: string;
  price?: number;
}

interface Props {
  booking: BookingLike;
  onClose: () => void;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    text: 'Bonjour ! Je confirme mon rendez-vous pour tout à l\'heure.',
    sender: 'client',
    time: '10:32',
  },
  {
    id: 'm2',
    text: 'Parfait ! Je serai là à l\'heure. Avez-vous des préférences particulières ?',
    sender: 'pro',
    time: '10:33',
  },
  {
    id: 'm3',
    text: 'Non, je vous fais confiance !',
    sender: 'client',
    time: '10:34',
  },
];

const AUTO_REPLIES = [
  'Je suis en route !',
  'J\'arrive dans 5 minutes.',
  'Merci pour votre confiance !',
  'À tout de suite !',
];

export default function MessagingSheet({ booking, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const now = new Date();
    const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newMsg: Message = { id: `m-${Date.now()}`, text: input, sender: 'pro', time };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    // Auto-reply
    setTimeout(() => {
      const reply: Message = {
        id: `m-auto-${Date.now()}`,
        text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        sender: 'client',
        time,
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 400,
        display: 'flex',
        alignItems: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          height: '70vh',
          background: '#0D0D13',
          borderRadius: '24px 24px 0 0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#F4F4F8', fontFamily: 'Inter, sans-serif' }}>
              {booking.clientName || 'Client'}
            </div>
            <div style={{ fontSize: '12px', color: '#54546C', fontFamily: 'Inter, sans-serif' }}>
              {booking.service || 'Service'} · {booking.price || 0} CHF
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X size={20} color="#54546C" />
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {messages.map(msg => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.sender === 'pro' ? 'flex-end' : 'flex-start',
              }}
            >
              <div style={{
                maxWidth: '75%',
                padding: '10px 14px',
                borderRadius: msg.sender === 'pro' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.sender === 'pro' ? '#F2D06B' : '#1C1C26',
                color: msg.sender === 'pro' ? '#050507' : '#F4F4F8',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
              }}>
                {msg.text}
                <div style={{ fontSize: '10px', color: msg.sender === 'pro' ? 'rgba(5,5,7,0.5)' : '#54546C', marginTop: '4px', textAlign: 'right' }}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '10px', flexShrink: 0 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Votre message..."
            style={{
              flex: 1,
              height: '44px',
              background: '#1C1C26',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '0 14px',
              color: '#F4F4F8',
              fontSize: '14px',
              outline: 'none',
              fontFamily: 'Inter, sans-serif',
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: '#F2D06B',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Send size={16} color="#050507" />
          </button>
        </div>
      </div>
    </div>
  );
}
