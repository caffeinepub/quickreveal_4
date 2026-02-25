import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { DemoPro } from '../data/mockData';

export type AppScreen =
  | 'login'
  | 'roleSelection'
  | 'roleSelectionV2'
  | 'clientOtp'
  | 'proOnboarding'
  | 'explorerV2'
  | 'proFiche'
  | 'bookingFlow'
  | 'liveStatus'
  | 'monBusiness'
  | 'subscriptionModal'
  | 'subscriptionSuccess'
  | 'proSuccess'
  | 'nexusOS'
  | 'radarPro'
  | 'walletPro'
  | 'clientDashboard'
  | 'otpVerification'
  | 'otp'
  | 'notificationCenter'
  | 'splash'
  | 'welcome'
  | 'explorer'
  | 'providerDetail'
  | 'bookingLocation'
  | 'bookingDate'
  | 'bookingContact'
  | 'subscription'
  | 'builder'
  | 'proLogin'
  | 'upgradeModal'
  | 'subscriptionScreen';

export type AppRole = 'client' | 'pro' | null;

export interface Notification {
  id: string;
  title: string;
  body?: string;
  message?: string;
  read: boolean;
  createdAt: number;
  timestamp?: number;
}

export interface Booking {
  id: string;
  proName: string;
  service: string;
  date: string;
  time?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  price: number;
}

export interface BookingData {
  proId?: string;
  proName?: string;
  service?: string;
  servicePrice?: number;
  location?: 'domicile' | 'studio';
  date?: string;
  timeSlot?: string;
  clientName?: string;
  clientPhone?: string;
  clientAddress?: string;
}

export interface SMSToastData {
  visible: boolean;
  message: string;
  phone: string;
}

export interface WalletData {
  solde: number;
  sequestre: number;
  transactions: any[];
  chartData: any[];
}

// Legacy type aliases
export type ProData = DemoPro;
export type ProProfileData = DemoPro;

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  duration: number;
  badge?: 'Populaire' | 'Nouveau' | 'Promo' | null;
}

export interface ReviewItem {
  author: string;
  note: number;
  text: string;
  date: string;
}

interface AppContextType {
  currentScreen: AppScreen;
  setCurrentScreen: (screen: AppScreen) => void;
  navigateTo: (screen: AppScreen) => void;
  goBack: () => void;
  appRole: AppRole;
  setAppRole: (role: AppRole) => void;
  selectedPro: DemoPro | null;
  setSelectedPro: (pro: DemoPro | null) => void;
  currentBooking: BookingData;
  setCurrentBooking: (booking: BookingData) => void;
  smsToast: SMSToastData;
  showSMSToast: (message: string, phone?: string) => void;
  hideSMSToast: () => void;
  flashActive: boolean;
  setFlashActive: (active: boolean) => void;
  subscriptionActive: boolean;
  setSubscriptionActive: (active: boolean) => void;
  proActif: boolean;
  setProActif: (v: boolean) => void;
  userName: string;
  setUserName: (name: string) => void;
  notifications: Notification[];
  addNotification: (notif: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAllRead: () => void;
  removeNotification: (id: string) => void;
  unreadCount: number;
  notificationCenterOpen: boolean;
  setNotificationCenterOpen: (open: boolean) => void;
  subscriptionModalOpen: boolean;
  openSubscriptionModal: () => void;
  closeSubscriptionModal: () => void;
  bookings: Booking[];
  setBookings: (bookings: Booking[]) => void;
  wallet: WalletData;
  selectedBookingService: ServiceItem | null;
  setSelectedBookingService: (s: ServiceItem | null) => void;
  essaiJours: number;
  setEssaiJours: (days: number) => void;
  proProfile: DemoPro | null;
  // Legacy helpers
  navigateToProProfile: (pro: DemoPro) => void;
  navigateToBookingFlow: () => void;
  setProProfile: (pro: DemoPro) => void;
  upgradeToProAccount: () => void;
  goToLanding: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_WALLET: WalletData = {
  solde: 240,
  sequestre: 55,
  transactions: [
    { nom: 'Thomas M.', montant: 55, type: 'entree', date: "Aujourd'hui 10:00" },
    { nom: 'Lucas B.', montant: 45, type: 'entree', date: "Aujourd'hui 13:30" },
    { nom: 'Antoine R.', montant: 40, type: 'entree', date: "Hier 16:00" },
    { nom: 'Mehdi A.', montant: 35, type: 'entree', date: "Hier 11:00" },
    { nom: 'Julien P.', montant: 30, type: 'entree', date: "Lun 14:30" },
    { nom: 'Virement IBAN', montant: -65, type: 'sortie', date: "Lun 09:00" },
  ],
  chartData: [40, 65, 55, 90, 110, 80, 20],
};

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('login');
  const [history, setHistory] = useState<AppScreen[]>([]);
  const [appRole, setAppRole] = useState<AppRole>(null);
  const [selectedPro, setSelectedPro] = useState<DemoPro | null>(null);
  const [currentBooking, setCurrentBooking] = useState<BookingData>({});
  const [smsToast, setSmsToast] = useState<SMSToastData>({ visible: false, message: '', phone: '' });
  const [flashActive, setFlashActive] = useState(false);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [proActif, setProActif] = useState(false);
  const [userName, setUserName] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBookingService, setSelectedBookingService] = useState<ServiceItem | null>(null);
  const [essaiJours, setEssaiJours] = useState(7);

  const navigateTo = useCallback((screen: AppScreen) => {
    setHistory(prev => [...prev, currentScreen]);
    setCurrentScreen(screen);
  }, [currentScreen]);

  const goBack = useCallback(() => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const newHistory = [...prev];
      const last = newHistory.pop()!;
      setCurrentScreen(last);
      return newHistory;
    });
  }, []);

  const showSMSToast = useCallback((message: string, phone = '+41 79 000 00 00') => {
    setSmsToast({ visible: true, message, phone });
  }, []);

  const hideSMSToast = useCallback(() => {
    setSmsToast(prev => ({ ...prev, visible: false }));
  }, []);

  const addNotification = useCallback((notif: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotif: Notification = {
      ...notif,
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      createdAt: Date.now(),
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const openSubscriptionModal = useCallback(() => setSubscriptionModalOpen(true), []);
  const closeSubscriptionModal = useCallback(() => setSubscriptionModalOpen(false), []);

  const navigateToProProfile = useCallback((pro: DemoPro) => {
    setSelectedPro(pro);
    setHistory(prev => [...prev, currentScreen]);
    setCurrentScreen('proFiche');
  }, [currentScreen]);

  const navigateToBookingFlow = useCallback(() => {
    setHistory(prev => [...prev, currentScreen]);
    setCurrentScreen('bookingFlow');
  }, [currentScreen]);

  const setProProfile = useCallback((pro: DemoPro) => {
    setSelectedPro(pro);
  }, []);

  const upgradeToProAccount = useCallback(() => {
    setAppRole('pro');
    setProActif(true);
    setSubscriptionActive(true);
    setHistory(prev => [...prev, currentScreen]);
    setCurrentScreen('nexusOS');
  }, [currentScreen]);

  const goToLanding = useCallback(() => {
    setHistory(prev => [...prev, currentScreen]);
    setCurrentScreen('login');
  }, [currentScreen]);

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        navigateTo,
        goBack,
        appRole,
        setAppRole,
        selectedPro,
        setSelectedPro,
        currentBooking,
        setCurrentBooking,
        smsToast,
        showSMSToast,
        hideSMSToast,
        flashActive,
        setFlashActive,
        subscriptionActive,
        setSubscriptionActive,
        proActif,
        setProActif,
        userName,
        setUserName,
        notifications,
        addNotification,
        markAllRead,
        removeNotification,
        unreadCount,
        notificationCenterOpen,
        setNotificationCenterOpen,
        subscriptionModalOpen,
        openSubscriptionModal,
        closeSubscriptionModal,
        bookings,
        setBookings,
        wallet: DEFAULT_WALLET,
        selectedBookingService,
        setSelectedBookingService,
        essaiJours,
        setEssaiJours,
        proProfile: selectedPro,
        navigateToProProfile,
        navigateToBookingFlow,
        setProProfile,
        upgradeToProAccount,
        goToLanding,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppContextProvider');
  return ctx;
}
