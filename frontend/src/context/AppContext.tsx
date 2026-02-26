import React, { createContext, useContext, useState, useCallback } from 'react';

// ── AppNotification type (defined locally to avoid circular import) ────────────

export interface AppNotification {
  id: string;
  type: 'nouvelle_demande' | 'paiement_confirme' | 'fonds_liberes' | 'avis_recu' | 'booking_confirme';
  bookingId?: string;
  timestamp: number;
  read: boolean;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type AppScreen =
  | 'splash'
  | 'landing'
  | 'login'
  | 'proLogin'
  | 'roleSelection'
  | 'roleSelectionV2'
  | 'otpVerification'
  | 'otpVerificationV2'
  | 'clientOtp'
  | 'otp'
  | 'welcome'
  | 'explorer'
  | 'explorerV2'
  | 'providerDetail'
  | 'proFiche'
  | 'bookingFlow'
  | 'bookingLocation'
  | 'bookingDate'
  | 'bookingContact'
  | 'liveStatus'
  | 'clientDashboard'
  | 'nexusOS'
  | 'monBusiness'
  | 'proOnboarding'
  | 'proSuccess'
  | 'radarPro'
  | 'walletPro'
  | 'builder'
  | 'subscription'
  | 'subscriptionScreen'
  | 'subscriptionSuccess'
  | 'subscriptionModal'
  | 'upgradeModal'
  | 'messaging'
  | 'notificationCenter'
  | 'admin';

export type AppRole = 'client' | 'pro' | null;

export interface DemoService {
  id?: string;
  nom: string;
  prix: number;
  duree: number;
  badge: string | null;
  description?: string;
  imageUrl?: string;
}

export interface DemoPro {
  id: string;
  prenom: string;
  nom: string;
  initials: string;
  categorie: string;
  ville: string;
  slogan: string;
  bio: string;
  note: number;
  nbAvis: number;
  prixDepuis: number;
  flashActif: boolean;
  nbPrestations: number;
  coverUrl?: string;
  photos?: string[];
  services?: DemoService[];
}

export type ProProfileData = DemoPro;

export interface Booking {
  id: string;
  proId?: string;
  proName?: string;
  service?: string;
  serviceId?: string;
  date?: string;
  time?: string;
  address?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  amount?: number;
  createdAt?: number;
  escrowReleaseAt?: number;
}

export interface Notification {
  type: string;
  message?: string;
  body?: string;
  timestamp?: number;
  read?: boolean;
}

interface AppContextValue {
  // Navigation
  currentScreen: AppScreen;
  navigateTo: (screen: AppScreen) => void;
  goToLanding: () => void;
  goBack: () => void;

  // Role
  appRole: AppRole;
  setAppRole: (role: AppRole) => void;

  // User
  userName: string;
  setUserName: (name: string) => void;

  // Pro profile
  proProfile: ProProfileData | null;
  setProProfile: (profile: ProProfileData | null) => void;

  // Selected pro (for client browsing)
  selectedPro: DemoPro | null;
  setSelectedPro: (pro: DemoPro | null) => void;
  navigateToProProfile: (pro: DemoPro) => void;
  navigateToBookingFlow: (pro?: DemoPro) => void;

  // Bookings
  bookings: Booking[];
  setBookings: (bookings: Booking[]) => void;
  currentBooking: Booking | null;
  setCurrentBooking: (booking: Booking | null) => void;

  // Wallet
  walletBalance: number;
  setWalletBalance: (balance: number) => void;

  // Subscription
  subscriptionActive: boolean;
  setSubscriptionActive: (active: boolean) => void;
  essaiJours: number;
  setEssaiJours: (jours: number) => void;
  upgradeToProAccount: () => void;

  // Flash
  flashActive: boolean;
  setFlashActive: (active: boolean) => void;

  // Notifications (legacy local)
  notifications: Notification[];
  addNotification: (notif: Notification) => void;
  markAllRead: () => void;
  notificationCenterOpen: boolean;
  setNotificationCenterOpen: (open: boolean) => void;

  // In-app notifications (from canister polling)
  inAppNotifications: AppNotification[];
  setInAppNotifications: (notifs: AppNotification[]) => void;
  unreadCount: number;
  markNotifRead: (id: string) => void;
  markAllNotifsRead: () => void;

  // Legacy compat
  proActif: boolean;
  setProActif: (v: boolean) => void;
  wallet: { solde: number; sequestre: number; transactions: unknown[]; chartData: unknown[] };
  selectedBookingService: null;
  setSelectedBookingService: (s: null) => void;
  removeNotification: (id: string) => void;
  subscriptionModalOpen: boolean;
  openSubscriptionModal: () => void;
  closeSubscriptionModal: () => void;
  smsToast: { visible: boolean; message: string; phone: string };
  showSMSToast: (message: string, phone?: string) => void;
  hideSMSToast: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [history, setHistory] = useState<AppScreen[]>([]);
  const [appRole, setAppRole] = useState<AppRole>(null);
  const [userName, setUserName] = useState('');
  const [proProfile, setProProfile] = useState<ProProfileData | null>(null);
  const [selectedPro, setSelectedPro] = useState<DemoPro | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [essaiJours, setEssaiJours] = useState(7);
  const [flashActive, setFlashActive] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [inAppNotifications, setInAppNotifications] = useState<AppNotification[]>([]);
  const [proActif, setProActif] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [smsToast, setSmsToast] = useState({ visible: false, message: '', phone: '' });

  const unreadCount = inAppNotifications.filter((n) => !n.read).length;

  const navigateTo = useCallback(
    (screen: AppScreen) => {
      setHistory((prev) => [...prev, currentScreen]);
      setCurrentScreen(screen);
    },
    [currentScreen]
  );

  const goBack = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const next = [...prev];
      const last = next.pop()!;
      setCurrentScreen(last);
      return next;
    });
  }, []);

  const goToLanding = useCallback(() => {
    setHistory((prev) => [...prev, currentScreen]);
    setCurrentScreen('landing');
  }, [currentScreen]);

  const navigateToProProfile = useCallback(
    (pro: DemoPro) => {
      setSelectedPro(pro);
      setHistory((prev) => [...prev, currentScreen]);
      setCurrentScreen('proFiche');
    },
    [currentScreen]
  );

  const navigateToBookingFlow = useCallback(
    (pro?: DemoPro) => {
      if (pro) setSelectedPro(pro);
      setHistory((prev) => [...prev, currentScreen]);
      setCurrentScreen('bookingFlow');
    },
    [currentScreen]
  );

  const addNotification = useCallback((notif: Notification) => {
    setNotifications((prev) => [notif, ...prev]);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((_id: string) => {
    // Legacy: notifications don't have ids in new type, no-op
  }, []);

  const upgradeToProAccount = useCallback(() => {
    setAppRole('pro');
    setSubscriptionActive(true);
    setProActif(true);
    setHistory((prev) => [...prev, currentScreen]);
    setCurrentScreen('nexusOS');
  }, [currentScreen]);

  const markNotifRead = useCallback((id: string) => {
    setInAppNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotifsRead = useCallback(() => {
    setInAppNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const openSubscriptionModal = useCallback(() => setSubscriptionModalOpen(true), []);
  const closeSubscriptionModal = useCallback(() => setSubscriptionModalOpen(false), []);

  const showSMSToast = useCallback((message: string, phone = '+41 79 000 00 00') => {
    setSmsToast({ visible: true, message, phone });
  }, []);

  const hideSMSToast = useCallback(() => {
    setSmsToast((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        navigateTo,
        goToLanding,
        goBack,
        appRole,
        setAppRole,
        userName,
        setUserName,
        proProfile,
        setProProfile,
        selectedPro,
        setSelectedPro,
        navigateToProProfile,
        navigateToBookingFlow,
        bookings,
        setBookings,
        currentBooking,
        setCurrentBooking,
        walletBalance,
        setWalletBalance,
        subscriptionActive,
        setSubscriptionActive,
        essaiJours,
        setEssaiJours,
        flashActive,
        setFlashActive,
        notifications,
        addNotification,
        markAllRead,
        notificationCenterOpen,
        setNotificationCenterOpen,
        inAppNotifications,
        setInAppNotifications,
        unreadCount,
        markNotifRead,
        markAllNotifsRead,
        upgradeToProAccount,
        proActif,
        setProActif,
        wallet: { solde: 0, sequestre: 0, transactions: [], chartData: [] },
        selectedBookingService: null,
        setSelectedBookingService: () => {},
        removeNotification,
        subscriptionModalOpen,
        openSubscriptionModal,
        closeSubscriptionModal,
        smsToast,
        showSMSToast,
        hideSMSToast,
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
