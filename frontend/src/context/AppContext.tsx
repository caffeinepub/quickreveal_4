import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ScreenType =
  | 'splash'
  | 'roleSelection'
  | 'otpVerification'
  | 'proOnboarding'
  | 'builder'
  | 'subscription'
  | 'explorer'
  | 'providerDetail'
  | 'bookingFlow'
  | 'clientDashboard'
  | 'nexusOS'
  | 'landing';

export type AppRole = 'client' | 'professional' | null;

export type LocalService = {
  id: string;
  name: string;
  price: number;
  duration: number;
  badges: string[];
  beforePhoto?: string;
  afterPhoto?: string;
};

export type LocalProProfile = {
  brandName: string;
  slogan: string;
  bio: string;
  category: string;
  city: string;
  radius: number;
  languages: string[];
  phone: string;
  revolut: string;
  revolutVerified: boolean;
  coverPhoto?: string;
  profilePhoto?: string;
  galleryPhotos: string[];
  services: LocalService[];
  atHomeService: boolean;
  minBookingLeadTime: number;
  flashMode: boolean;
  flashActivatedAt?: number;
  subscriptionActive: boolean;
  trialStartDate?: number;
  isPublished: boolean;
};

export type LocalBooking = {
  id: string;
  proId: string;
  proName: string;
  serviceName: string;
  servicePrice: number;
  date: string;
  timeSlot: string;
  address: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: number;
  clientName?: string;
  clientRating?: number;
};

export type Notification = {
  id: string;
  type: 'flash' | 'confirmed' | 'payment' | 'review' | 'dispute' | 'reminder' | 'sms';
  message: string;
  timestamp: number;
  read: boolean;
};

interface AppContextType {
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  /** Alias for setCurrentScreen — supports optional params stored in screenParams */
  navigate: (screen: ScreenType, params?: Record<string, unknown>) => void;
  screenParams: Record<string, unknown>;
  goBack: () => void;
  screenHistory: ScreenType[];
  appRole: AppRole;
  setAppRole: (role: AppRole) => void;
  phoneVerified: boolean;
  setPhoneVerified: (v: boolean) => void;
  proProfile: LocalProProfile;
  setProProfile: (p: LocalProProfile | ((prev: LocalProProfile) => LocalProProfile)) => void;
  selectedProId: string | null;
  setSelectedProId: (id: string | null) => void;
  selectedServiceId: string | null;
  setSelectedServiceId: (id: string | null) => void;
  bookings: LocalBooking[];
  setBookings: (b: LocalBooking[] | ((prev: LocalBooking[]) => LocalBooking[])) => void;
  notifications: Notification[];
  setNotifications: (n: Notification[] | ((prev: Notification[]) => Notification[])) => void;
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  unreadCount: number;
  markAllRead: () => void;
  walletBalance: number;
  escrowBalance: number;
  setWalletBalance: (v: number) => void;
  setEscrowBalance: (v: number) => void;
}

const defaultProProfile: LocalProProfile = {
  brandName: '',
  slogan: '',
  bio: '',
  category: '',
  city: '',
  radius: 10,
  languages: ['FR'],
  phone: '',
  revolut: '',
  revolutVerified: false,
  coverPhoto: undefined,
  profilePhoto: undefined,
  galleryPhotos: [],
  services: [],
  atHomeService: true,
  minBookingLeadTime: 1,
  flashMode: false,
  subscriptionActive: false,
  isPublished: false,
};

const AppContext = createContext<AppContextType | null>(null);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [screenParams, setScreenParams] = useState<Record<string, unknown>>({});
  const [screenHistory, setScreenHistory] = useState<ScreenType[]>(['splash']);
  const [appRole, setAppRole] = useState<AppRole>(null);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [proProfile, setProProfile] = useState<LocalProProfile>(defaultProProfile);
  const [selectedProId, setSelectedProId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<LocalBooking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'n1',
      type: 'flash',
      message: '⚡ Nouvelle demande Flash reçue de Sophie M.',
      timestamp: Date.now() - 300000,
      read: false,
    },
    {
      id: 'n2',
      type: 'confirmed',
      message: '✅ Réservation confirmée — Coupe homme à 20h00',
      timestamp: Date.now() - 600000,
      read: false,
    },
    {
      id: 'n3',
      type: 'payment',
      message: '💰 Paiement de 55 CHF reçu et sécurisé',
      timestamp: Date.now() - 900000,
      read: true,
    },
  ]);
  const [walletBalance, setWalletBalance] = useState(240);
  const [escrowBalance, setEscrowBalance] = useState(55);

  const navigate = useCallback((screen: ScreenType, params?: Record<string, unknown>) => {
    setScreenHistory(prev => [...prev, screen]);
    setCurrentScreen(screen);
    setScreenParams(params || {});
  }, []);

  const goBack = useCallback(() => {
    setScreenHistory(prev => {
      if (prev.length <= 1) return prev;
      const newHistory = prev.slice(0, -1);
      setCurrentScreen(newHistory[newHistory.length - 1]);
      return newHistory;
    });
    setScreenParams({});
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    setNotifications(prev => [
      {
        ...n,
        id: `notif-${Date.now()}`,
        timestamp: Date.now(),
        read: false,
      },
      ...prev,
    ]);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        navigate,
        screenParams,
        goBack,
        screenHistory,
        appRole,
        setAppRole,
        phoneVerified,
        setPhoneVerified,
        proProfile,
        setProProfile,
        selectedProId,
        setSelectedProId,
        selectedServiceId,
        setSelectedServiceId,
        bookings,
        setBookings,
        notifications,
        setNotifications,
        addNotification,
        unreadCount,
        markAllRead,
        walletBalance,
        escrowBalance,
        setWalletBalance,
        setEscrowBalance,
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
