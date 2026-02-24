import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

const AUTO_RESPONSES: { [key: string]: string } = {
  booking: 'Pour gérer vos réservations, rendez-vous dans l\'onglet "Agenda" de votre dashboard. Vous pouvez accepter, refuser ou modifier les créneaux horaires.',
  payment: 'Les paiements sont traités de manière sécurisée via Stripe. Vous recevrez vos fonds sous 2-3 jours ouvrés sur votre compte bancaire.',
  technical: 'Pour les problèmes techniques, essayez de vider le cache de votre navigateur (Ctrl+Shift+Delete). Si le problème persiste, notre équipe technique vous contactera sous 24h.',
  account: 'Pour modifier vos informations de compte, allez dans "Paramètres" > "Profil". Vous pouvez y changer votre nom, email, téléphone et photo de profil.',
  default: 'Merci pour votre message ! Notre équipe vous répond dans les 2 minutes. En attendant, consultez notre FAQ ou décrivez votre problème plus en détail.',
};

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Je suis votre assistant NEXUS. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'support',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAutoResponse = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('réservation') || lowerText.includes('booking')) return AUTO_RESPONSES.booking;
    if (lowerText.includes('paiement') || lowerText.includes('payment')) return AUTO_RESPONSES.payment;
    if (lowerText.includes('bug') || lowerText.includes('erreur') || lowerText.includes('problème')) return AUTO_RESPONSES.technical;
    if (lowerText.includes('compte') || lowerText.includes('profil')) return AUTO_RESPONSES.account;
    return AUTO_RESPONSES.default;
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAutoResponse(inputText),
        sender: 'support',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, supportMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const quickActions = [
    { label: 'Réinitialiser mot de passe', action: 'account' },
    { label: 'Annuler une réservation', action: 'booking' },
    { label: 'Problème technique', action: 'technical' },
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B87333] shadow-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300 flex items-center justify-center group"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-[#0A0A0A]" />
        ) : (
          <MessageCircle className="w-6 h-6 text-[#0A0A0A] group-hover:scale-110 transition-transform" />
        )}
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] backdrop-blur-xl bg-[#0A0A0A]/95 border border-[#F5F5F7]/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-[#F5F5F7]/10 flex items-center gap-3">
            <div className="relative">
              <img
                src="/assets/generated/support-avatar.dim_80x80.png"
                alt="Support"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0A0A0A]" />
            </div>
            <div>
              <div className="font-bold text-[#F5F5F7]">Support NEXUS</div>
              <div className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Équipe en ligne
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-[#0A0A0A]'
                      : 'bg-[#F5F5F7]/10 text-[#F5F5F7]'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#F5F5F7]/10 rounded-2xl px-4 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[#F5F5F7]/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-[#F5F5F7]/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-[#F5F5F7]/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 border-t border-[#F5F5F7]/10">
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputText(action.label);
                    handleSend();
                  }}
                  className="text-xs px-3 py-1 bg-[#F5F5F7]/10 hover:bg-[#F5F5F7]/20 rounded-full text-[#F5F5F7]/80 transition-all"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-[#F5F5F7]/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Tapez votre message..."
                className="flex-1 bg-[#F5F5F7]/10 border border-[#F5F5F7]/20 rounded-xl px-4 py-2 text-[#F5F5F7] text-sm focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                onClick={handleSend}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B87333] flex items-center justify-center hover:scale-105 transition-transform"
              >
                <Send className="w-5 h-5 text-[#0A0A0A]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
