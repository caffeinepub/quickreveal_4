import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface Service {
  id: string;
  name: string;
  priceStudio: number | null;
  priceDomicile: number | null;
  duration: string;
}

export interface Provider {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  city: string;
  modes: string[];
  bio: string;
  priceFrom: number;
  coverPhotoUrl: string;
  services: Service[];
  lat: number;
  lng: number;
  studioAddress?: string;
  studioLat?: number;
  studioLng?: number;
  blockedSlots?: Array<{ date: string; time: string }>;
  availability?: { [day: string]: string[] };
}

export interface BookingFormData {
  name: string;
  phone: string;
  address: string;
}

export interface SelectedDateTime {
  date: Date;
  time: string;
}

export interface ClientSession {
  phone: string;
  isAuthenticated: boolean;
}

export interface ProSession {
  email: string;
  isAuthenticated: boolean;
}

export interface BookingRequest {
  id: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  location: string;
  price: number;
  status: 'pending' | 'accepted' | 'refused';
}

export interface ClientReservation {
  id: string;
  providerName: string;
  providerPhone: string;
  providerAddress: string;
  service: string;
  date: string;
  time: string;
  location: string;
  status: 'pending' | 'confirmed' | 'completed';
}

export interface PublishedStudio {
  name: string;
  category: string;
  city: string;
  phone: string;
  bio: string;
  modes: string[];
  studioAddress?: string;
  studioLat?: number;
  studioLng?: number;
  services: Array<{
    name: string;
    priceDomicile: number | null;
    priceStudio: number | null;
    duration: string;
  }>;
  availability: { [day: string]: string[] };
  coverPhotoUrl: string;
}

export type ScreenType =
  | 'splash'
  | 'explorer'
  | 'providerDetail'
  | 'bookingLocation'
  | 'bookingDate'
  | 'bookingContact'
  | 'clientLogin'
  | 'clientDashboard'
  | 'proLogin'
  | 'nexusOS'
  | 'builder'
  | 'subscription';

interface AppState {
  currentScreen: ScreenType;
  selectedCategory: string;
  selectedMode: string;
  selectedCity: string;
  selectedProvider: Provider | null;
  selectedService: Service | null;
  selectedLocation: 'domicile' | 'studio' | null;
  selectedDateTime: SelectedDateTime | null;
  bookingFormData: BookingFormData;
  providers: Provider[];
  isClientAuthenticated: boolean;
  isProAuthenticated: boolean;
  clientSession: ClientSession | null;
  proSession: ProSession | null;
  bookingRequests: BookingRequest[];
  clientReservations: ClientReservation[];
  publishedStudio: PublishedStudio | null;
  activeNexusTab: 'radar' | 'wallet' | 'portfolio' | 'agenda';
  currentAgendaWeekOffset: number;
  setCurrentScreen: (screen: ScreenType) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedMode: (mode: string) => void;
  setSelectedCity: (city: string) => void;
  setSelectedProvider: (provider: Provider | null) => void;
  setSelectedService: (service: Service | null) => void;
  setSelectedLocation: (location: 'domicile' | 'studio' | null) => void;
  setSelectedDateTime: (dateTime: SelectedDateTime | null) => void;
  setBookingFormData: (data: BookingFormData) => void;
  goToSplash: () => void;
  goToExplorer: () => void;
  goToClientLogin: () => void;
  goToClientDashboard: () => void;
  goToProLogin: () => void;
  goToNexusOS: () => void;
  goToBuilder: () => void;
  goToSubscription: () => void;
  loginClient: (phone: string) => void;
  logoutClient: () => void;
  loginPro: (email: string) => void;
  logoutPro: () => void;
  acceptBookingRequest: (id: string) => void;
  refuseBookingRequest: (id: string) => void;
  cancelClientReservation: (id: string) => void;
  updateProviderStudio: (address: string, lat: number, lng: number) => void;
  toggleAgendaSlot: (date: string, time: string) => void;
  publishStudio: (studio: PublishedStudio) => void;
  setActiveNexusTab: (tab: 'radar' | 'wallet' | 'portfolio' | 'agenda') => void;
  setCurrentAgendaWeekOffset: (offset: number) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

// Hardcoded providers data with GPS coordinates
const INITIAL_PROVIDERS: Provider[] = [
  {
    id: 'p1',
    name: 'JULIEN ROSSI',
    category: 'coiffure',
    categoryLabel: 'Coiffure',
    city: 'Lausanne',
    modes: ['domicile', 'salon'],
    bio: "L'art du rasage royal. Une précision chirurgicale pour une élite exigeante.",
    priceFrom: 40,
    coverPhotoUrl: '/assets/generated/provider-julien-rossi.dim_800x600.png',
    lat: 46.5197,
    lng: 6.6323,
    studioAddress: 'Rue de Bourg 12, 1003 Lausanne',
    studioLat: 46.5197,
    studioLng: 6.6323,
    services: [
      {
        id: 's1',
        name: 'Coupe & Barbe (Domicile)',
        priceStudio: null,
        priceDomicile: 60,
        duration: '60 min',
      },
      {
        id: 's2',
        name: 'Coupe Studio',
        priceStudio: 40,
        priceDomicile: null,
        duration: '45 min',
      },
      {
        id: 's3',
        name: 'Dégradé Supreme',
        priceStudio: 50,
        priceDomicile: 60,
        duration: '45 min',
      },
      {
        id: 's4',
        name: 'Barbe Sculptée',
        priceStudio: 30,
        priceDomicile: null,
        duration: '20 min',
      },
    ],
    blockedSlots: [],
  },
  {
    id: 'p2',
    name: 'MAGESTE LABS',
    category: 'coiffure',
    categoryLabel: 'Coiffure',
    city: 'Payerne',
    modes: ['salon'],
    bio: "L'art du rasage royal. Une précision chirurgicale pour une élite exigeante.",
    priceFrom: 30,
    coverPhotoUrl: '/assets/generated/provider-mageste-labs.dim_800x600.png',
    lat: 46.8119,
    lng: 6.9378,
    studioAddress: 'Avenue de la Gare 5, 1530 Payerne',
    studioLat: 46.8119,
    studioLng: 6.9378,
    services: [
      {
        id: 's5',
        name: 'Dégradé Supreme',
        priceStudio: 50,
        priceDomicile: null,
        duration: '45 min',
      },
      {
        id: 's6',
        name: 'Barbe Sculptée',
        priceStudio: 30,
        priceDomicile: null,
        duration: '20 min',
      },
      {
        id: 's7',
        name: 'Rituel Royal',
        priceStudio: 60,
        priceDomicile: null,
        duration: '75 min',
      },
    ],
    blockedSlots: [],
  },
  {
    id: 'p3',
    name: 'SOPHIANE HAIR',
    category: 'barber',
    categoryLabel: 'Barber',
    city: 'Genève',
    modes: ['domicile', 'salon'],
    bio: "Coupe, couleur et soin. L'excellence capillaire à domicile ou en salon.",
    priceFrom: 55,
    coverPhotoUrl: '/assets/generated/provider-sophiane-hair.dim_800x600.png',
    lat: 46.2044,
    lng: 6.1432,
    studioAddress: 'Rue du Rhône 45, 1204 Genève',
    studioLat: 46.2044,
    studioLng: 6.1432,
    services: [
      {
        id: 's8',
        name: 'Coupe femme',
        priceStudio: 55,
        priceDomicile: 75,
        duration: '60 min',
      },
      {
        id: 's9',
        name: 'Coloration',
        priceStudio: 90,
        priceDomicile: 110,
        duration: '2h',
      },
      {
        id: 's10',
        name: 'Brushing',
        priceStudio: 35,
        priceDomicile: 50,
        duration: '45 min',
      },
    ],
    blockedSlots: [],
  },
  {
    id: 'p4',
    name: 'LUCIE ESTHETICS',
    category: 'esthetique',
    categoryLabel: 'Esthétique',
    city: 'Lausanne',
    modes: ['domicile', 'salon'],
    bio: "Soins visage & corps d'exception. Produits biologiques, résultats visibles.",
    priceFrom: 60,
    coverPhotoUrl: '/assets/generated/provider-lucie-esthetics.dim_800x600.png',
    lat: 46.5225,
    lng: 6.6356,
    studioAddress: 'Place de la Palud 8, 1003 Lausanne',
    studioLat: 46.5225,
    studioLng: 6.6356,
    services: [
      {
        id: 's11',
        name: 'Soin visage signature',
        priceStudio: 65,
        priceDomicile: 85,
        duration: '90 min',
      },
      {
        id: 's12',
        name: 'Épilation complète',
        priceStudio: 55,
        priceDomicile: 70,
        duration: '60 min',
      },
      {
        id: 's13',
        name: 'Manucure Gel',
        priceStudio: 40,
        priceDomicile: 55,
        duration: '60 min',
      },
    ],
    blockedSlots: [],
  },
  {
    id: 'p5',
    name: 'ZEN TOUCH',
    category: 'massage',
    categoryLabel: 'Massage',
    city: 'Genève',
    modes: ['domicile'],
    bio: 'Massage thérapeutique et bien-être. Je me déplace dans tout le canton.',
    priceFrom: 80,
    coverPhotoUrl: '/assets/generated/provider-zen-touch.dim_800x600.png',
    lat: 46.2017,
    lng: 6.1466,
    services: [
      {
        id: 's14',
        name: 'Massage relaxant 60min',
        priceStudio: null,
        priceDomicile: 90,
        duration: '60 min',
      },
      {
        id: 's15',
        name: 'Massage deep tissue',
        priceStudio: null,
        priceDomicile: 110,
        duration: '90 min',
      },
      {
        id: 's16',
        name: 'Reflexologie',
        priceStudio: null,
        priceDomicile: 75,
        duration: '45 min',
      },
    ],
    blockedSlots: [],
  },
  {
    id: 'p6',
    name: 'NOURA BEAUTY',
    category: 'onglerie',
    categoryLabel: 'Onglerie',
    city: 'Lausanne',
    modes: ['salon'],
    bio: 'Votre sanctuaire de bien-être. Rituels ancestraux pour une détente absolue.',
    priceFrom: 70,
    coverPhotoUrl: '/assets/generated/provider-noura-beauty.dim_800x600.png',
    lat: 46.5191,
    lng: 6.6335,
    studioAddress: 'Avenue de la Gare 22, 1003 Lausanne',
    studioLat: 46.5191,
    studioLng: 6.6335,
    services: [
      {
        id: 's17',
        name: 'Hammam Royal',
        priceStudio: 95,
        priceDomicile: null,
        duration: '90 min',
      },
      {
        id: 's18',
        name: 'Gommage corps',
        priceStudio: 70,
        priceDomicile: null,
        duration: '60 min',
      },
    ],
    blockedSlots: [],
  },
];

// Demo booking requests
const INITIAL_BOOKING_REQUESTS: BookingRequest[] = [
  {
    id: 'br1',
    clientName: 'Sophie Martin',
    service: 'Coupe & Barbe',
    date: '2026-02-25',
    time: '14:00',
    location: 'Domicile',
    price: 60,
    status: 'pending',
  },
  {
    id: 'br2',
    clientName: 'Marc Dubois',
    service: 'Dégradé Supreme',
    date: '2026-02-26',
    time: '10:30',
    location: 'Studio',
    price: 50,
    status: 'pending',
  },
];

// Demo client reservations
const INITIAL_CLIENT_RESERVATIONS: ClientReservation[] = [
  {
    id: 'cr1',
    providerName: 'JULIEN ROSSI',
    providerPhone: '+41 79 123 45 67',
    providerAddress: 'Rue de Bourg 12, 1003 Lausanne',
    service: 'Coupe Studio',
    date: '2026-02-28',
    time: '15:00',
    location: 'Studio',
    status: 'pending',
  },
];

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [selectedMode, setSelectedMode] = useState<string>('Tous');
  const [selectedCity, setSelectedCity] = useState<string>('Tous');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<'domicile' | 'studio' | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<SelectedDateTime | null>(null);
  const [bookingFormData, setBookingFormData] = useState<BookingFormData>({
    name: '',
    phone: '',
    address: '',
  });
  const [providers, setProviders] = useState<Provider[]>(INITIAL_PROVIDERS);
  const [isClientAuthenticated, setIsClientAuthenticated] = useState(false);
  const [isProAuthenticated, setIsProAuthenticated] = useState(false);
  const [clientSession, setClientSession] = useState<ClientSession | null>(null);
  const [proSession, setProSession] = useState<ProSession | null>(null);
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>(
    INITIAL_BOOKING_REQUESTS
  );
  const [clientReservations, setClientReservations] = useState<ClientReservation[]>(
    INITIAL_CLIENT_RESERVATIONS
  );
  const [publishedStudio, setPublishedStudio] = useState<PublishedStudio | null>(null);
  const [activeNexusTab, setActiveNexusTab] = useState<'radar' | 'wallet' | 'portfolio' | 'agenda'>('radar');
  const [currentAgendaWeekOffset, setCurrentAgendaWeekOffset] = useState(0);

  const goToSplash = () => setCurrentScreen('splash');
  const goToExplorer = () => setCurrentScreen('explorer');
  const goToClientLogin = () => setCurrentScreen('clientLogin');
  const goToClientDashboard = () => setCurrentScreen('clientDashboard');
  const goToProLogin = () => setCurrentScreen('proLogin');
  const goToNexusOS = () => setCurrentScreen('nexusOS');
  const goToBuilder = () => setCurrentScreen('builder');
  const goToSubscription = () => setCurrentScreen('subscription');

  const loginClient = (phone: string) => {
    setIsClientAuthenticated(true);
    setClientSession({ phone, isAuthenticated: true });
  };

  const logoutClient = () => {
    setIsClientAuthenticated(false);
    setClientSession(null);
    setCurrentScreen('splash');
  };

  const loginPro = (email: string) => {
    setIsProAuthenticated(true);
    setProSession({ email, isAuthenticated: true });
  };

  const logoutPro = () => {
    setIsProAuthenticated(false);
    setProSession(null);
    setCurrentScreen('splash');
  };

  const acceptBookingRequest = (id: string) => {
    setBookingRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'accepted' as const } : req))
    );
  };

  const refuseBookingRequest = (id: string) => {
    setBookingRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const cancelClientReservation = (id: string) => {
    setClientReservations((prev) => prev.filter((res) => res.id !== id));
  };

  const updateProviderStudio = (address: string, lat: number, lng: number) => {
    if (selectedProvider) {
      const updatedProvider = {
        ...selectedProvider,
        studioAddress: address,
        studioLat: lat,
        studioLng: lng,
      };
      setProviders((prev) =>
        prev.map((p) => (p.id === selectedProvider.id ? updatedProvider : p))
      );
      setSelectedProvider(updatedProvider);
    }
  };

  const toggleAgendaSlot = (date: string, time: string) => {
    if (selectedProvider) {
      const blockedSlots = selectedProvider.blockedSlots || [];
      const existingIndex = blockedSlots.findIndex(
        (slot) => slot.date === date && slot.time === time
      );

      let updatedSlots;
      if (existingIndex >= 0) {
        // Remove slot (unblock)
        updatedSlots = blockedSlots.filter((_, idx) => idx !== existingIndex);
      } else {
        // Add slot (block)
        updatedSlots = [...blockedSlots, { date, time }];
      }

      const updatedProvider = {
        ...selectedProvider,
        blockedSlots: updatedSlots,
      };

      setProviders((prev) =>
        prev.map((p) => (p.id === selectedProvider.id ? updatedProvider : p))
      );
      setSelectedProvider(updatedProvider);
    }
  };

  const publishStudio = (studio: PublishedStudio) => {
    setPublishedStudio(studio);
    
    // Add published studio to providers list
    const newProvider: Provider = {
      id: `p${Date.now()}`,
      name: studio.name,
      category: studio.category.toLowerCase(),
      categoryLabel: studio.category,
      city: studio.city,
      modes: studio.modes,
      bio: studio.bio,
      priceFrom: Math.min(
        ...studio.services
          .map(s => [s.priceDomicile, s.priceStudio])
          .flat()
          .filter((p): p is number => p !== null)
      ),
      coverPhotoUrl: studio.coverPhotoUrl,
      lat: studio.studioLat || 46.5197,
      lng: studio.studioLng || 6.6323,
      studioAddress: studio.studioAddress,
      studioLat: studio.studioLat,
      studioLng: studio.studioLng,
      services: studio.services.map((s, idx) => ({
        id: `s${Date.now()}_${idx}`,
        name: s.name,
        priceStudio: s.priceStudio,
        priceDomicile: s.priceDomicile,
        duration: s.duration,
      })),
      blockedSlots: [],
      availability: studio.availability,
    };

    setProviders((prev) => [...prev, newProvider]);
    setSelectedProvider(newProvider);
  };

  const value: AppState = {
    currentScreen,
    selectedCategory,
    selectedMode,
    selectedCity,
    selectedProvider,
    selectedService,
    selectedLocation,
    selectedDateTime,
    bookingFormData,
    providers,
    isClientAuthenticated,
    isProAuthenticated,
    clientSession,
    proSession,
    bookingRequests,
    clientReservations,
    publishedStudio,
    activeNexusTab,
    currentAgendaWeekOffset,
    setCurrentScreen,
    setSelectedCategory,
    setSelectedMode,
    setSelectedCity,
    setSelectedProvider,
    setSelectedService,
    setSelectedLocation,
    setSelectedDateTime,
    setBookingFormData,
    goToSplash,
    goToExplorer,
    goToClientLogin,
    goToClientDashboard,
    goToProLogin,
    goToNexusOS,
    goToBuilder,
    goToSubscription,
    loginClient,
    logoutClient,
    loginPro,
    logoutPro,
    acceptBookingRequest,
    refuseBookingRequest,
    cancelClientReservation,
    updateProviderStudio,
    toggleAgendaSlot,
    publishStudio,
    setActiveNexusTab,
    setCurrentAgendaWeekOffset,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppState => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
};
