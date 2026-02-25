/*
TWILIO_SMS_INTEGRATION
Activer en production avec backend securise
Ne jamais appeler Twilio depuis le frontend

const sendSMS = async (to: string, body: string) => {
  // Passer par canister Motoko ou backend
  // pour ne pas exposer les credentials
  const SID = process.env.TWILIO_ACCOUNT_SID;
  const TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const FROM = process.env.TWILIO_PHONE;
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${SID}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${SID}:${TOKEN}`),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        From: FROM,
        To: to,
        Body: body
      })
    }
  );
  return response.json();
};

CRITICAL SECURITY: Twilio credentials (ACCOUNT_SID, AUTH_TOKEN, TWILIO_PHONE)
must NEVER be exposed in frontend code. All SMS sending MUST be handled by the
Motoko backend canister using HTTP outcalls. This stub is for documentation only
and must never execute in production.
*/

import React, { useEffect, useState } from 'react';
import { IconMessage } from './icons/Icons';

interface SMSToastProps {
  visible: boolean;
  message: string;
  phone: string;
  onDismiss?: () => void;
}

export default function SMSToast({ visible, message, phone, onDismiss }: SMSToastProps) {
  const [animState, setAnimState] = useState<'hidden' | 'entering' | 'visible' | 'leaving'>('hidden');

  useEffect(() => {
    if (visible) {
      setAnimState('entering');
      const t1 = setTimeout(() => setAnimState('visible'), 10);
      const t2 = setTimeout(() => setAnimState('leaving'), 4000);
      const t3 = setTimeout(() => {
        setAnimState('hidden');
        onDismiss?.();
      }, 4300);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else {
      setAnimState('hidden');
    }
  }, [visible, onDismiss]);

  if (animState === 'hidden') return null;

  const isLeaving = animState === 'leaving';
  const isEntering = animState === 'entering';

  return (
    <div
      style={{
        position: 'fixed',
        top: '72px',
        left: '20px',
        right: '20px',
        zIndex: 9999,
        background: 'rgba(9,9,13,0.97)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderLeft: '4px solid #00D97A',
        borderRadius: '16px',
        padding: '16px 18px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        transform: isLeaving ? 'translateY(-10px)' : isEntering ? 'translateY(-20px)' : 'translateY(0)',
        opacity: isLeaving ? 0 : isEntering ? 0 : 1,
        transition: 'transform 300ms ease-out, opacity 300ms ease-out',
        maxWidth: '390px',
        margin: '0 auto',
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <IconMessage size={18} color="#00D97A" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '13px', color: '#F4F4F8' }}>
          SMS envoye
        </span>
        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '12px', color: '#9898B4', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {message}
        </span>
        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '11px', color: '#54546C', marginTop: '4px' }}>
          {phone}
        </span>
      </div>
    </div>
  );
}
