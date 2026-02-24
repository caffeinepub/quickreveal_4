import React, { useState } from 'react';
import { Bell, X, Zap, CheckCircle, DollarSign, Star, AlertTriangle, Calendar, MessageSquare } from 'lucide-react';
import { useAppContext, Notification } from '../context/AppContext';

function getNotificationIcon(type: Notification['type']) {
  switch (type) {
    case 'flash': return <Zap size={16} className="text-yellow-400" />;
    case 'confirmed': return <CheckCircle size={16} className="text-nexus-success" />;
    case 'payment': return <DollarSign size={16} className="text-nexus-gold" />;
    case 'review': return <Star size={16} className="text-yellow-400" />;
    case 'dispute': return <AlertTriangle size={16} className="text-nexus-urgent" />;
    case 'reminder': return <Calendar size={16} className="text-blue-400" />;
    case 'sms': return <MessageSquare size={16} className="text-purple-400" />;
    default: return <Bell size={16} className="text-nexus-secondary" />;
  }
}

function formatTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'À l\'instant';
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  return `Il y a ${Math.floor(hours / 24)}j`;
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAllRead } = useAppContext();

  const handleOpen = () => {
    setIsOpen(true);
    markAllRead();
  };

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-full hover:bg-nexus-card transition-colors"
      >
        <Bell size={22} className="text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-nexus-urgent rounded-full flex items-center justify-center text-white text-xs font-bold red-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-4" onClick={() => setIsOpen(false)}>
          <div
            className="w-80 max-h-96 bg-nexus-card border border-nexus-border rounded-nexus shadow-card overflow-hidden slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-nexus-border">
              <h3 className="text-white font-semibold">Notifications</h3>
              <button onClick={() => setIsOpen(false)} className="text-nexus-secondary hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto max-h-80">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-nexus-secondary">
                  <Bell size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Aucune notification</p>
                </div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-3 border-b border-nexus-border last:border-0 ${!notif.read ? 'bg-nexus-bg/50' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white leading-snug">{notif.message}</p>
                        <p className="text-xs text-nexus-secondary mt-1">{formatTime(notif.timestamp)}</p>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 bg-nexus-gold rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
