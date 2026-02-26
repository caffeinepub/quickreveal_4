import { useState, useCallback } from 'react';

export type Screen =
  | 'setup'
  | 'login'
  | 'role'
  | 'otp'
  | 'explorer'
  | 'fiche_pro'
  | 'booking_1'
  | 'booking_2'
  | 'booking_3'
  | 'booking_4'
  | 'booking_5'
  | 'live_status'
  | 'client_reservations'
  | 'client_alertes'
  | 'client_profil'
  | 'pro_dashboard'
  | 'pro_radar'
  | 'pro_wallet'
  | 'pro_business'
  | 'pro_subscription'
  | 'pro_success'
  | 'admin_login'
  | 'admin_dashboard'
  | 'admin_pros'
  | 'admin_bookings'
  | 'admin_revenus';

export type Role = 'client' | 'pro' | 'admin';
export type ProTab = 'dashboard' | 'radar' | 'wallet' | 'business';
export type ClientTab = 'explorer' | 'reservations' | 'alertes' | 'profil';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'sms' | 'gold';
  duration?: number;
}

export interface AppState {
  screen: Screen;
  prevScreen: Screen;
  role: Role | null;
  proTab: ProTab;
  clientTab: ClientTab;
  isAuthenticated: boolean;
  principal: string | null;
  userPhone: string;
  userEmail: string;
  userName: string;
  selectedPro: Record<string, unknown> | null;
  selectedService: Record<string, unknown> | null;
  bookingPro: Record<string, unknown> | null;
  bookingService: Record<string, unknown> | null;
  bookingCreneau: string;
  bookingAdresse: string;
  bookingVille: string;
  bookingPhone: string;
  bookingNote: string;
  bookingId: string | null;
  notifsOpen: boolean;
  loading: boolean;
  loadingMsg: string;
  toasts: ToastItem[];
  adminAuthenticated: boolean;
}

const initialState: AppState = {
  screen: 'login',
  prevScreen: 'login',
  role: null,
  proTab: 'dashboard',
  clientTab: 'explorer',
  isAuthenticated: false,
  principal: null,
  userPhone: '',
  userEmail: '',
  userName: '',
  selectedPro: null,
  selectedService: null,
  bookingPro: null,
  bookingService: null,
  bookingCreneau: '',
  bookingAdresse: '',
  bookingVille: '',
  bookingPhone: '',
  bookingNote: '',
  bookingId: null,
  notifsOpen: false,
  loading: false,
  loadingMsg: '',
  toasts: [],
  adminAuthenticated: false,
};

export function useAppState() {
  const [state, setState] = useState<AppState>(initialState);

  const go = useCallback((screen: Screen) => {
    setState((prev) => ({ ...prev, prevScreen: prev.screen, screen }));
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => ({ ...prev, screen: prev.prevScreen }));
  }, []);

  const update = useCallback((partial: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastItem['type'] = 'info', duration = 3500) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      setState((prev) => ({
        ...prev,
        toasts: [...prev.toasts, { id, message, type, duration }],
      }));
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          toasts: prev.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      toasts: prev.toasts.filter((t) => t.id !== id),
    }));
  }, []);

  return { state, go, goBack, update, showToast, removeToast };
}
