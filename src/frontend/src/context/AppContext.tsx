import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface Service {
  id: string;
  name: string;
  priceStudio: number | null;
  priceDomicile: number | null;
  duration: string;
  photos?: string[];
}

export interface Subscription {
  status: 'none' | 'trial' | 'active' | 'cancelled';
  trialEndsAt?: number | null;
  nextBillingDate?: number | null;
  paymentMethod?: {
    cardLast4: string;
    cardExpiry: string;
  } | null;
}

export interface Review {
  id: string;
  providerId: string;
  clientName: string;
  rating: number;
  comment: string;
  date: number;
}

export interface Provider {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  city: string | string[];
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
  coverPhoto?: string | null;
  gallery?: string[];
  subscription?: Subscription;
  rating?: number;
  reviewCount?: number;
  reviews?: Review[];
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
  city: string | string[];
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
    photos?: string[];
  }>;
  availability: { [day: string]: string[] };
  coverPhotoUrl: string;
  coverPhoto?: string | null;
  gallery?: string[];
}

export interface QuoteData {
  size: string;
  complexity: string;
  color: string;
  style: string;
  calculatedPrice: number;
  serviceDescription: string;
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
  quoteData: QuoteData | null;
  userRole: 'artist' | 'client' | null;
  setCurrentScreen: (screen: ScreenType) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedMode: (mode: string) => void;
  setSelectedCity: (city: string) => void;
  setSelectedProvider: (provider: Provider | null) => void;
  setSelectedService: (service: Service | null) => void;
  setSelectedLocation: (location: 'domicile' | 'studio' | null) => void;
  setSelectedDateTime: (dateTime: SelectedDateTime | null) => void;
  setBookingFormData: (data: BookingFormData) => void;
  setQuoteData: (data: QuoteData | null) => void;
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
  unpublishProvider: () => void;
  setActiveNexusTab: (tab: 'radar' | 'wallet' | 'portfolio' | 'agenda') => void;
  setCurrentAgendaWeekOffset: (offset: number) => void;
  updateSubscription: (subscription: Subscription) => void;
  cancelSubscription: () => void;
  submitReview: (providerId: string, clientName: string, rating: number, comment: string) => void;
  calculateAverageRating: (providerId: string) => number;
}

const AppContext = createContext<AppState | undefined>(undefined);

// Hardcoded providers data with GPS coordinates
const INITIAL_PROVIDERS: Provider[] = [
  {
    id: 'p1',
    name: 'JULIEN ROSSI',
    category: 'barber',
    categoryLabel: 'Barber',
    city: ['Lausanne', 'Genève'],
    modes: ['domicile', 'salon'],
    bio: "Coupe et taille de barbe avec précision. Style classique et moderne.",
    priceFrom: 45,
    coverPhotoUrl: '/assets/generated/provider-julien-rossi.dim_800x600.png',
    lat: 46.5197,
    lng: 6.6323,
    studioAddress: 'Rue de Bourg 12, 1003 Lausanne',
    studioLat: 46.5197,
    studioLng: 6.6323,
    services: [
      {
        id: 's1',
        name: 'Coupe homme',
        priceStudio: 45,
        priceDomicile: 60,
        duration: '45 min',
      },
      {
        id: 's2',
        name: 'Barbe',
        priceStudio: 30,
        priceDomicile: 40,
        duration: '30 min',
      },
    ],
    blockedSlots: [],
    subscription: { status: 'active' },
    rating: 4.8,
    reviewCount: 127,
    reviews: [],
  },
  {
    id: 'p2',
    name: 'MAGESTE LABS',
    category: 'coiffure',
    categoryLabel: 'Coiffure',
    city: ['Payerne'],
    modes: ['salon'],
    bio: "Salon de coiffure moderne. Coupes tendances et colorations.",
    priceFrom: 60,
    coverPhotoUrl: '/assets/generated/provider-mageste-labs.dim_800x600.png',
    lat: 46.8119,
    lng: 6.9378,
    studioAddress: 'Avenue de la Gare 5, 1530 Payerne',
    studioLat: 46.8119,
    studioLng: 6.9378,
    services: [
      {
        id: 's3',
        name: 'Coupe femme',
        priceStudio: 60,
        priceDomicile: null,
        duration: '60 min',
      },
      {
        id: 's4',
        name: 'Coloration',
        priceStudio: 120,
        priceDomicile: null,
        duration: '2h',
      },
    ],
    blockedSlots: [],
    subscription: { status: 'active' },
    rating: 4.9,
    reviewCount: 89,
    reviews: [],
  },
  {
    id: 'p3',
    name: 'SOPHIANE HAIR',
    category: 'coiffure',
    categoryLabel: 'Coiffure',
    city: ['Lausanne'],
    modes: ['domicile', 'salon'],
    bio: "Coiffure à domicile ou en salon. Spécialiste des cheveux afro et texturés.",
    priceFrom: 50,
    coverPhotoUrl: '/assets/generated/provider-sophiane-hair.dim_800x600.png',
    lat: 46.5197,
    lng: 6.6323,
    studioAddress: 'Rue du Simplon 8, 1006 Lausanne',
    studioLat: 46.5197,
    studioLng: 6.6323,
    services: [
      {
        id: 's5',
        name: 'Coupe + Brushing',
        priceStudio: 50,
        priceDomicile: 70,
        duration: '90 min',
      },
    ],
    blockedSlots: [],
    subscription: { status: 'active' },
    rating: 4.7,
    reviewCount: 64,
    reviews: [],
  },
  {
    id: 'p4',
    name: 'LUCIE ESTHETICS',
    category: 'esthétique',
    categoryLabel: 'Esthétique',
    city: ['Genève'],
    modes: ['salon'],
    bio: "Soins du visage et épilation. Produits bio et naturels.",
    priceFrom: 40,
    coverPhotoUrl: '/assets/generated/provider-lucie-esthetics.dim_800x600.png',
    lat: 46.2044,
    lng: 6.1432,
    studioAddress: 'Rue du Rhône 45, 1204 Genève',
    studioLat: 46.2044,
    studioLng: 6.1432,
    services: [
      {
        id: 's6',
        name: 'Soin visage',
        priceStudio: 80,
        priceDomicile: null,
        duration: '60 min',
      },
      {
        id: 's7',
        name: 'Épilation sourcils',
        priceStudio: 25,
        priceDomicile: null,
        duration: '20 min',
      },
    ],
    blockedSlots: [],
    subscription: { status: 'active' },
    rating: 4.9,
    reviewCount: 112,
    reviews: [],
  },
  {
    id: 'p5',
    name: 'ZEN TOUCH',
    category: 'massage',
    categoryLabel: 'Massage',
    city: ['Lausanne', 'Genève'],
    modes: ['domicile', 'salon'],
    bio: "Massages relaxants et thérapeutiques. Déplacement à domicile possible.",
    priceFrom: 90,
    coverPhotoUrl: '/assets/generated/provider-zen-touch.dim_800x600.png',
    lat: 46.5197,
    lng: 6.6323,
    studioAddress: 'Avenue de la Gare 22, 1003 Lausanne',
    studioLat: 46.5197,
    studioLng: 6.6323,
    services: [
      {
        id: 's8',
        name: 'Massage relaxant',
        priceStudio: 90,
        priceDomicile: 110,
        duration: '60 min',
      },
      {
        id: 's9',
        name: 'Massage thérapeutique',
        priceStudio: 120,
        priceDomicile: 140,
        duration: '90 min',
      },
    ],
    blockedSlots: [],
    subscription: { status: 'active' },
    rating: 4.8,
    reviewCount: 95,
    reviews: [],
  },
  {
    id: 'p6',
    name: 'NOURA BEAUTY',
    category: 'onglerie',
    categoryLabel: 'Onglerie',
    city: ['Payerne'],
    modes: ['salon'],
    bio: "Pose d'ongles et nail art. Manucure et pédicure.",
    priceFrom: 35,
    coverPhotoUrl: '/assets/generated/provider-noura-beauty.dim_800x600.png',
    lat: 46.8119,
    lng: 6.9378,
    studioAddress: 'Rue de la Plaine 14, 1530 Payerne',
    studioLat: 46.8119,
    studioLng: 6.9378,
    services: [
      {
        id: 's10',
        name: 'Manucure',
        priceStudio: 35,
        priceDomicile: null,
        duration: '45 min',
      },
      {
        id: 's11',
        name: 'Pose gel',
        priceStudio: 70,
        priceDomicile: null,
        duration: '90 min',
      },
    ],
    blockedSlots: [],
    subscription: { status: 'active' },
    rating: 4.7,
    reviewCount: 78,
    reviews: [],
  },
];

// Demo booking requests
const INITIAL_BOOKING_REQUESTS: BookingRequest[] = [
  {
    id: 'br1',
    clientName: 'Sophie Martin',
    service: 'Coupe homme',
    date: '2026-02-25',
    time: '14:00',
    location: 'Domicile',
    price: 60,
    status: 'pending',
  },
  {
    id: 'br2',
    clientName: 'Marc Dubois',
    service: 'Barbe',
    date: '2026-02-26',
    time: '10:30',
    location: 'Studio',
    price: 30,
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
    service: 'Coupe homme',
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
  const [providers, setProviders] = useState<Provider[]>(() => {
    const stored = localStorage.getItem('nexus_platform_v1_providers');
    return stored ? JSON.parse(stored) : INITIAL_PROVIDERS;
  });
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
  const [publishedStudio, setPublishedStudio] = useState<PublishedStudio | null>(() => {
    const stored = localStorage.getItem('nexus_platform_v1_published_studio');
    return stored ? JSON.parse(stored) : null;
  });
  const [activeNexusTab, setActiveNexusTab] = useState<'radar' | 'wallet' | 'portfolio' | 'agenda'>('radar');
  const [currentAgendaWeekOffset, setCurrentAgendaWeekOffset] = useState(0);
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [userRole, setUserRole] = useState<'artist' | 'client' | null>(() => {
    const stored = localStorage.getItem('nexus_platform_v1_user_role');
    return stored as 'artist' | 'client' | null;
  });

  // Persist providers to localStorage
  useEffect(() => {
    localStorage.setItem('nexus_platform_v1_providers', JSON.stringify(providers));
  }, [providers]);

  // Persist published studio to localStorage
  useEffect(() => {
    if (publishedStudio) {
      localStorage.setItem('nexus_platform_v1_published_studio', JSON.stringify(publishedStudio));
    }
  }, [publishedStudio]);

  // Persist user role
  useEffect(() => {
    if (userRole) {
      localStorage.setItem('nexus_platform_v1_user_role', userRole);
    } else {
      localStorage.removeItem('nexus_platform_v1_user_role');
    }
  }, [userRole]);

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
    setUserRole('client');
    goToClientDashboard();
  };

  const logoutClient = () => {
    setIsClientAuthenticated(false);
    setClientSession(null);
    setUserRole(null);
    goToSplash();
  };

  const loginPro = (email: string) => {
    setIsProAuthenticated(true);
    setProSession({ email, isAuthenticated: true });
    setUserRole('artist');
    goToNexusOS();
  };

  const logoutPro = () => {
    setIsProAuthenticated(false);
    setProSession(null);
    setUserRole(null);
    goToSplash();
  };

  const acceptBookingRequest = (id: string) => {
    setBookingRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'accepted' as const } : req))
    );
  };

  const refuseBookingRequest = (id: string) => {
    setBookingRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'refused' as const } : req))
    );
  };

  const cancelClientReservation = (id: string) => {
    setClientReservations((prev) => prev.filter((res) => res.id !== id));
  };

  const updateProviderStudio = (address: string, lat: number, lng: number) => {
    if (publishedStudio) {
      setPublishedStudio({
        ...publishedStudio,
        studioAddress: address,
        studioLat: lat,
        studioLng: lng,
      });
    }
  };

  const toggleAgendaSlot = (date: string, time: string) => {
    if (selectedProvider) {
      const blockedSlots = selectedProvider.blockedSlots || [];
      const existingIndex = blockedSlots.findIndex(
        (slot) => slot.date === date && slot.time === time
      );

      if (existingIndex >= 0) {
        blockedSlots.splice(existingIndex, 1);
      } else {
        blockedSlots.push({ date, time });
      }

      setSelectedProvider({ ...selectedProvider, blockedSlots });
    }
  };

  const publishStudio = (studio: PublishedStudio) => {
    setPublishedStudio(studio);
    const newProvider: Provider = {
      id: `p${Date.now()}`,
      name: studio.name,
      category: studio.category,
      categoryLabel: studio.category,
      city: studio.city,
      modes: studio.modes,
      bio: studio.bio,
      priceFrom: Math.min(
        ...studio.services
          .map((s) => [s.priceStudio, s.priceDomicile])
          .flat()
          .filter((p): p is number => p !== null)
      ),
      coverPhotoUrl: studio.coverPhotoUrl,
      services: studio.services.map((s, i) => ({ ...s, id: `s${Date.now()}_${i}` })),
      lat: studio.studioLat || 46.5197,
      lng: studio.studioLng || 6.6323,
      studioAddress: studio.studioAddress,
      studioLat: studio.studioLat,
      studioLng: studio.studioLng,
      blockedSlots: [],
      availability: studio.availability,
      coverPhoto: studio.coverPhoto,
      gallery: studio.gallery,
      subscription: { status: 'active' },
      rating: 5.0,
      reviewCount: 0,
      reviews: [],
    };
    setProviders((prev) => [...prev, newProvider]);
  };

  const unpublishProvider = () => {
    if (publishedStudio) {
      setProviders((prev) => prev.filter((p) => p.name !== publishedStudio.name));
      setPublishedStudio(null);
      localStorage.removeItem('nexus_platform_v1_published_studio');
    }
  };

  const updateSubscription = (subscription: Subscription) => {
    if (publishedStudio) {
      setPublishedStudio({ ...publishedStudio });
    }
    if (selectedProvider) {
      setSelectedProvider({ ...selectedProvider, subscription });
    }
  };

  const cancelSubscription = () => {
    if (publishedStudio) {
      setPublishedStudio({ ...publishedStudio });
    }
    if (selectedProvider) {
      setSelectedProvider({
        ...selectedProvider,
        subscription: { status: 'cancelled' },
      });
    }
  };

  const submitReview = (providerId: string, clientName: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: `r${Date.now()}`,
      providerId,
      clientName,
      rating,
      comment,
      date: Date.now(),
    };

    setProviders((prev) =>
      prev.map((p) => {
        if (p.id === providerId) {
          const reviews = [...(p.reviews || []), newReview];
          const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
          return {
            ...p,
            reviews,
            rating: Math.round(avgRating * 10) / 10,
            reviewCount: reviews.length,
          };
        }
        return p;
      })
    );
  };

  const calculateAverageRating = (providerId: string): number => {
    const provider = providers.find((p) => p.id === providerId);
    if (!provider || !provider.reviews || provider.reviews.length === 0) return 0;
    const sum = provider.reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / provider.reviews.length) * 10) / 10;
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
    quoteData,
    userRole,
    setCurrentScreen,
    setSelectedCategory,
    setSelectedMode,
    setSelectedCity,
    setSelectedProvider,
    setSelectedService,
    setSelectedLocation,
    setSelectedDateTime,
    setBookingFormData,
    setQuoteData,
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
    unpublishProvider,
    setActiveNexusTab,
    setCurrentAgendaWeekOffset,
    updateSubscription,
    cancelSubscription,
    submitReview,
    calculateAverageRating,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
};
