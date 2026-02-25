export interface DemoPro {
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
  services?: DemoService[];
  reviews?: DemoReview[];
  galleryGradients?: string[];
  hasRevolut?: boolean;
  revolutHandle?: string;
  photos?: string[];
}

export interface DemoService {
  id: string;
  name: string;
  duration: number;
  price: number;
  description?: string;
  badge?: string;
}

export interface DemoReview {
  id: string;
  author?: string;
  name?: string;
  rating: number;
  comment?: string;
  text?: string;
  date?: string;
}

export const DEMO_PROS: DemoPro[] = [
  {
    id: '1',
    name: 'Julien Rossi',
    category: 'Coiffure',
    city: 'Genève',
    rating: 4.9,
    reviewCount: 127,
    startingPrice: 45,
    isFlash: true,
    flashActive: true,
    flashResponseTime: 5,
    responseTime: 8,
    acceptanceRate: 94,
    serviceCount: 6,
    gradient: 'linear-gradient(135deg, #1C1C26, #2A2A3A)',
    coverGradient: 'linear-gradient(135deg, #0D0D13, #1C1C26)',
    slogan: 'Coiffure premium à domicile',
    bio: 'Coiffeur professionnel avec 10 ans d\'expérience. Spécialisé dans les coupes modernes et colorations.',
    hasRevolut: true,
    revolutHandle: '@julienrossi',
    services: [
      { id: 's1', name: 'Coupe homme', duration: 30, price: 45, badge: 'Populaire' },
      { id: 's2', name: 'Coupe femme', duration: 60, price: 75 },
      { id: 's3', name: 'Coloration', duration: 120, price: 140, badge: 'Nouveau' },
      { id: 's4', name: 'Brushing', duration: 45, price: 55 },
    ],
    reviews: [
      { id: 'r1', name: 'Marie D.', rating: 5, text: 'Excellent travail, très professionnel!', date: '2026-02-10' },
      { id: 'r2', name: 'Sophie L.', rating: 5, text: 'Parfait comme toujours', date: '2026-02-05' },
    ],
    galleryGradients: [
      'linear-gradient(135deg, #1C1C26, #2A2A3A)',
      'linear-gradient(135deg, #0D0D13, #1C1C26)',
      'linear-gradient(135deg, #2A2A3A, #1C1C26)',
      'linear-gradient(135deg, #1C1C26, #0D0D13)',
    ],
  },
  {
    id: '2',
    name: 'Lucie Esthetics',
    category: 'Esthétique',
    city: 'Lausanne',
    rating: 4.8,
    reviewCount: 89,
    startingPrice: 60,
    isFlash: false,
    flashActive: false,
    responseTime: 15,
    acceptanceRate: 88,
    serviceCount: 8,
    gradient: 'linear-gradient(135deg, #1C1C26, #2A2A3A)',
    slogan: 'Beauté naturelle et bien-être',
    bio: 'Esthéticienne certifiée, spécialisée dans les soins du visage et du corps.',
    hasRevolut: true,
    revolutHandle: '@lucieesthetics',
    services: [
      { id: 's1', name: 'Soin visage', duration: 60, price: 80, badge: 'Populaire' },
      { id: 's2', name: 'Épilation', duration: 45, price: 60 },
      { id: 's3', name: 'Manucure', duration: 60, price: 70 },
    ],
    reviews: [
      { id: 'r1', name: 'Emma B.', rating: 5, text: 'Magnifique résultat!', date: '2026-02-08' },
    ],
    galleryGradients: [
      'linear-gradient(135deg, #1C1C26, #2A2A3A)',
      'linear-gradient(135deg, #0D0D13, #1C1C26)',
    ],
  },
  {
    id: '3',
    name: 'Zen Touch',
    category: 'Massage',
    city: 'Genève',
    rating: 4.9,
    reviewCount: 203,
    startingPrice: 80,
    isFlash: true,
    flashActive: true,
    flashResponseTime: 10,
    responseTime: 12,
    acceptanceRate: 96,
    serviceCount: 5,
    gradient: 'linear-gradient(135deg, #1C1C26, #2A2A3A)',
    slogan: 'Relaxation et bien-être à domicile',
    bio: 'Masseur certifié, 8 ans d\'expérience. Techniques suédoises et deep tissue.',
    hasRevolut: false,
    services: [
      { id: 's1', name: 'Massage relaxant', duration: 60, price: 90, badge: 'Populaire' },
      { id: 's2', name: 'Massage sportif', duration: 90, price: 120 },
    ],
    reviews: [
      { id: 'r1', name: 'Pierre M.', rating: 5, text: 'Incroyable, je recommande!', date: '2026-02-12' },
    ],
    galleryGradients: [
      'linear-gradient(135deg, #1C1C26, #2A2A3A)',
      'linear-gradient(135deg, #0D0D13, #1C1C26)',
    ],
  },
  {
    id: '4',
    name: 'Noura Beauty',
    category: 'Esthétique',
    city: 'Fribourg',
    rating: 4.7,
    reviewCount: 64,
    startingPrice: 55,
    isFlash: false,
    flashActive: false,
    responseTime: 20,
    acceptanceRate: 85,
    serviceCount: 6,
    gradient: 'linear-gradient(135deg, #1C1C26, #2A2A3A)',
    slogan: 'Beauté orientale authentique',
    bio: 'Spécialiste en soins orientaux et maquillage professionnel.',
    hasRevolut: true,
    revolutHandle: '@nourabeauty',
    services: [
      { id: 's1', name: 'Maquillage', duration: 60, price: 85 },
      { id: 's2', name: 'Soin corps', duration: 90, price: 110 },
    ],
    reviews: [],
    galleryGradients: [
      'linear-gradient(135deg, #1C1C26, #2A2A3A)',
    ],
  },
  {
    id: '5',
    name: 'Sophiane Hair',
    category: 'Coiffure',
    city: 'Lausanne',
    rating: 4.8,
    reviewCount: 156,
    startingPrice: 50,
    isFlash: true,
    flashActive: true,
    flashResponseTime: 7,
    responseTime: 10,
    acceptanceRate: 91,
    serviceCount: 7,
    gradient: 'linear-gradient(135deg, #1C1C26, #2A2A3A)',
    slogan: 'Coiffure afro et texturée',
    bio: 'Spécialiste des cheveux texturés et afro. Techniques modernes et soins naturels.',
    hasRevolut: true,
    revolutHandle: '@sophianehair',
    services: [
      { id: 's1', name: 'Coupe afro', duration: 90, price: 80, badge: 'Populaire' },
      { id: 's2', name: 'Tresses', duration: 180, price: 150 },
      { id: 's3', name: 'Défrisage', duration: 120, price: 120 },
    ],
    reviews: [
      { id: 'r1', name: 'Aïcha K.', rating: 5, text: 'Parfait pour mes cheveux!', date: '2026-02-14' },
    ],
    galleryGradients: [
      'linear-gradient(135deg, #1C1C26, #2A2A3A)',
      'linear-gradient(135deg, #0D0D13, #1C1C26)',
    ],
  },
  {
    id: '6',
    name: 'Mageste Labs',
    category: 'Barbier',
    city: 'Genève',
    rating: 4.9,
    reviewCount: 312,
    startingPrice: 35,
    isFlash: true,
    flashActive: true,
    flashResponseTime: 3,
    responseTime: 5,
    acceptanceRate: 98,
    serviceCount: 5,
    gradient: 'linear-gradient(135deg, #1C1C26, #2A2A3A)',
    slogan: 'Le barbier de référence à Genève',
    bio: 'Barbier expert depuis 12 ans. Coupes classiques et modernes, rasage traditionnel.',
    hasRevolut: true,
    revolutHandle: '@magestelabs',
    services: [
      { id: 's1', name: 'Coupe homme', duration: 30, price: 35, badge: 'Populaire' },
      { id: 's2', name: 'Barbe', duration: 20, price: 25 },
      { id: 's3', name: 'Coupe + Barbe', duration: 45, price: 55, badge: 'Promo' },
      { id: 's4', name: 'Rasage traditionnel', duration: 30, price: 40 },
    ],
    reviews: [
      { id: 'r1', name: 'Thomas R.', rating: 5, text: 'Le meilleur barbier de Genève!', date: '2026-02-15' },
      { id: 'r2', name: 'Lucas M.', rating: 5, text: 'Toujours impeccable.', date: '2026-02-10' },
    ],
    galleryGradients: [
      'linear-gradient(135deg, #1C1C26, #2A2A3A)',
      'linear-gradient(135deg, #0D0D13, #1C1C26)',
      'linear-gradient(135deg, #2A2A3A, #1C1C26)',
    ],
  },
];

export const CITIES = ['Genève', 'Lausanne', 'Berne', 'Zurich', 'Bâle', 'Fribourg', 'Neuchâtel', 'Sion'];
export const SWISS_CITIES = CITIES;

export const CATEGORIES = ['Coiffure', 'Esthétique', 'Massage', 'Barbier', 'Ongles', 'Maquillage'];
export const FILTER_CATEGORIES = ['Tous', ...CATEGORIES];

export const WALLET_CHART_DATA = [
  { day: 'L', month: 'L', amount: 45 },
  { day: 'M', month: 'M', amount: 120 },
  { day: 'M', month: 'M', amount: 80 },
  { day: 'J', month: 'J', amount: 200 },
  { day: 'V', month: 'V', amount: 95 },
  { day: 'S', month: 'S', amount: 240 },
  { day: 'D', month: 'D', amount: 60 },
];

export const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Nouvelle réservation', message: 'Marie D. a réservé', read: false, createdAt: Date.now() - 3600000 },
  { id: '2', title: 'Paiement reçu', message: '85 CHF crédités', read: true, createdAt: Date.now() - 7200000 },
];
