import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type AppRole = 'client' | 'pro' | null;

export type Screen =
  | 'splash'
  | 'roleSelection'
  | 'otpVerification'
  | 'otp'
  | 'subscription'
  | 'subscriptionScreen'
  | 'proLogin'
  | 'clientDashboard'
  | 'nexusOS'
  | 'explorer'
  | 'monBusiness'
  | 'walletPro'
  | 'radarPro'
  | 'notificationCenter'
  | 'proProfile'
  | 'bookingFlow'
  | 'liveStatus'
  | 'landing'
  | 'builder'
  | 'welcome'
  | 'pro-dashboard'
  | 'radar-pro'
  | 'wallet-pro'
  | 'mon-business';

export interface ProProfileData {
  id: string;
  name: string;
  category: string;
  city: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  isFlash: boolean;
  flashActive: boolean;
  flashResponseTime?: number;
  responseTime?: number;
  acceptanceRate?: number;
  serviceCount?: number;
  gradient?: string;
  coverGradient?: string;
  slogan?: string;
  bio?: string;
  emoji?: string;
  services?: Service[];
  reviews?: Review[];
  galleryGradients?: string[];
  hasRevolut?: boolean;
  revolutHandle?: string;
  photos?: string[];
}

export interface Service {
  id: string;
  name: string;
  duration: number | string;
  price: number;
  description?: string;
  badge?: string;
}

export interface Review {
  id: string;
  author?: string;
  name?: string;
  rating: number;
  comment?: string;
  text?: string;
  date?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  body?: string; // kept for backward compat
  read: boolean;
  createdAt: number;
}

// Alias for backward compatibility
export type LocalBooking = Booking;

export interface Booking {
  id: string;
  proId?: string;
  proName: string;
  serviceId?: string;
  serviceName?: string;
  service?: string;
  price: number;
  date: string;
  timeSlot?: string;
  time?: string;
  address?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: number;
}

export interface WalletData {
  balance: number;
  escrow: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  label: string;
  amount: number;
  date: string;
  type: 'credit' | 'debit';
}

// FlashRequest kept for backward compat with MessagingSheet
export interface FlashRequest {
  id: string;
  clientName: string;
  clientAvatar: string;
  clientRating: number;
  service: string;
  price: number;
  distance: string;
  expiresAt: number;
  status: 'pending' | 'confirmed' | 'declined';
}

interface AppContextType {
  // Navigation
  currentScreen: Screen;
  navigateTo: (screen: Screen) => void;
  navigate: (screen: Screen) => void;
  goBack: () => void;
  screenHistory: Screen[];

  // User
  appRole: AppRole;
  setAppRole: (role: AppRole) => void;
  userName: string;
  setUserName: (name: string) => void;

  // Pro
  proProfile: ProProfileData | null;
  setProProfile: (profile: ProProfileData | null) => void;
  flashActive: boolean;
  setFlashActive: (active: boolean) => void;
  proActif: boolean;
  setProActif: (active: boolean) => void;
  essaiJours: number;
  setEssaiJours: (days: number) => void;

  // Wallet
  wallet: WalletData;
  setWallet: (wallet: WalletData) => void;

  // Bookings
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  currentBooking: Booking | null;
  setCurrentBooking: (booking: Booking | null) => void;

  // Notifications
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAllRead: () => void;
  markNotificationsRead: () => void;
  removeNotification: (id: string) => void;

  // Radar
  radarBadgePulse: boolean;
  setRadarBadgePulse: (pulse: boolean) => void;

  // Subscription
  subscriptionActive: boolean;
  setSubscriptionActive: (active: boolean) => void;

  // Selected pro for profile view
  selectedPro: ProProfileData | null;
  navigateToProProfile: (pro: ProProfileData) => void;
  navigateToBookingFlow: (pro: ProProfileData, service?: any) => void;
  navigateToLiveStatus: () => void;

  // Upgrade
  upgradeToProAccount: () => void;

  // Landing
  goToLanding: () => void;

  // Notification center
  notificationCenterOpen: boolean;
  setNotificationCenterOpen: (open: boolean) => void;

  // Flash requests (for RadarPro / MessagingSheet compat)
  flashRequests: FlashRequest[];
  addFlashRequest: (req: FlashRequest) => void;
  updateFlashRequest: (id: string, status: 'confirmed' | 'declined') => void;
}

const AppContext = createContext<AppContextType | null>(null);

const INITIAL_WALLET: WalletData = {
  balance: 240,
  escrow: 55,
  transactions: [
    { id: '1', label: 'Réservation - Julien Rossi', amount: 85, date: '2026-02-20', type: 'credit' },
    { id: '2', label: 'Réservation - Lucie Esthetics', amount: 120, date: '2026-02-18', type: 'credit' },
    { id: '3', label: 'Virement Revolut', amount: -200, date: '2026-02-15', type: 'debit' },
    { id: '4', label: 'Réservation - Zen Touch', amount: 95, date: '2026-02-12', type: 'credit' },
  ],
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Nouvelle réservation',
    message: 'Marie D. a réservé une coupe pour demain à 14h',
    read: false,
    createdAt: Date.now() - 3600000,
  },
  {
    id: '2',
    title: 'Paiement reçu',
    message: '85 CHF crédités sur votre wallet',
    read: false,
    createdAt: Date.now() - 7200000,
  },
  {
    id: '3',
    title: 'Avis client',
    message: 'Sophie L. vous a laissé 5 étoiles',
    read: true,
    createdAt: Date.now() - 86400000,
  },
];

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [screenHistory, setScreenHistory] = useState<Screen[]>(['splash']);
  const [appRole, setAppRole] = useState<AppRole>(null);
  const [userName, setUserName] = useState('');
  const [proProfile, setProProfile] = useState<ProProfileData | null>(null);
  const [flashActive, setFlashActive] = useState(false);
  const [proActif, setProActif] = useState(false);
  const [essaiJours, setEssaiJours] = useState(0);
  const [wallet, setWallet] = useState<WalletData>(INITIAL_WALLET);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [radarBadgePulse, setRadarBadgePulse] = useState(true);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [selectedPro, setSelectedPro] = useState<ProProfileData | null>(null);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [flashRequests, setFlashRequests] = useState<FlashRequest[]>([]);

  const navigateTo = useCallback((screen: Screen) => {
    setCurrentScreen(screen);
    setScreenHistory(prev => [...prev, screen]);
  }, []);

  const navigate = navigateTo;

  const goBack = useCallback(() => {
    setScreenHistory(prev => {
      if (prev.length <= 1) return prev;
      const newHistory = prev.slice(0, -1);
      setCurrentScreen(newHistory[newHistory.length - 1]);
      return newHistory;
    });
  }, []);

  const addBooking = useCallback((booking: Booking) => {
    setBookings(prev => [...prev, booking]);
  }, []);

  const updateBookingStatus = useCallback((id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  }, []);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const markNotificationsRead = markAllRead;

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const navigateToProProfile = useCallback((pro: ProProfileData) => {
    setSelectedPro(pro);
    navigateTo('proProfile');
  }, [navigateTo]);

  const navigateToBookingFlow = useCallback((pro: ProProfileData, _service?: any) => {
    setSelectedPro(pro);
    navigateTo('bookingFlow');
  }, [navigateTo]);

  const navigateToLiveStatus = useCallback(() => {
    navigateTo('liveStatus');
  }, [navigateTo]);

  const upgradeToProAccount = useCallback(() => {
    setAppRole('pro');
    navigateTo('nexusOS');
  }, [navigateTo]);

  const goToLanding = useCallback(() => {
    navigateTo('landing');
  }, [navigateTo]);

  const addFlashRequest = useCallback((req: FlashRequest) => {
    setFlashRequests(prev => [req, ...prev]);
  }, []);

  const updateFlashRequest = useCallback((id: string, status: 'confirmed' | 'declined') => {
    setFlashRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      currentScreen,
      navigateTo,
      navigate,
      goBack,
      screenHistory,
      appRole,
      setAppRole,
      userName,
      setUserName,
      proProfile,
      setProProfile,
      flashActive,
      setFlashActive,
      proActif,
      setProActif,
      essaiJours,
      setEssaiJours,
      wallet,
      setWallet,
      bookings,
      addBooking,
      updateBookingStatus,
      currentBooking,
      setCurrentBooking,
      notifications,
      unreadCount,
      addNotification,
      markAllRead,
      markNotificationsRead,
      removeNotification,
      radarBadgePulse,
      setRadarBadgePulse,
      subscriptionActive,
      setSubscriptionActive,
      selectedPro,
      navigateToProProfile,
      navigateToBookingFlow,
      navigateToLiveStatus,
      upgradeToProAccount,
      goToLanding,
      notificationCenterOpen,
      setNotificationCenterOpen,
      flashRequests,
      addFlashRequest,
      updateFlashRequest,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppContextProvider');
  return ctx;
}
