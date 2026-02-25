export interface DemoService {
  nom: string;
  prix: number;
  duree: number;
  badge?: string;
  imageUrl?: string;
}

export interface DemoPro {
  id: string;
  prenom: string;
  nom: string;
  initials: string;
  gradient: string;
  coverGradient: string;
  coverUrl: string;
  categorie: string;
  ville: string;
  note: number;
  avis: number;
  slogan: string;
  bio: string;
  flashActif: boolean;
  isFlash: boolean;
  hasRevolut: boolean;
  revolutHandle: string;
  responseTime: string;
  acceptanceRate: number;
  serviceCount: number;
  startingPrice: number;
  flashResponseTime: string;
  services: DemoService[];
  reviews: { auteur: string; note: number; texte: string; date: string }[];
  galleryGradients: string[];
}

const BARBER_SERVICES: DemoService[] = [
  { nom: 'Coupe homme', prix: 35, duree: 30, badge: 'Populaire', imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&h=200&fit=crop&q=80' },
  { nom: 'Degrade premium', prix: 45, duree: 45, badge: 'Top', imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300&h=200&fit=crop&q=80' },
  { nom: 'Coupe + Barbe', prix: 55, duree: 60, imageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=300&h=200&fit=crop&q=80' },
  { nom: 'Barbe design', prix: 25, duree: 20, imageUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=200&fit=crop&q=80' },
  { nom: 'Rasage traditionnel', prix: 40, duree: 40, imageUrl: 'https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=300&h=200&fit=crop&q=80' },
];

const COIFFURE_SERVICES: DemoService[] = [
  { nom: 'Coupe femme', prix: 55, duree: 45, badge: 'Populaire', imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&h=200&fit=crop&q=80' },
  { nom: 'Couleur', prix: 95, duree: 90, imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=200&fit=crop&q=80' },
  { nom: 'Meches', prix: 120, duree: 120, imageUrl: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=300&h=200&fit=crop&q=80' },
  { nom: 'Brushing', prix: 40, duree: 30, imageUrl: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=300&h=200&fit=crop&q=80' },
];

const ESTHETIQUE_SERVICES: DemoService[] = [
  { nom: 'Soin visage', prix: 75, duree: 60, badge: 'Populaire', imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&h=200&fit=crop&q=80' },
  { nom: 'Manucure', prix: 45, duree: 45, imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&h=200&fit=crop&q=80' },
  { nom: 'Pedicure', prix: 55, duree: 50, imageUrl: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=300&h=200&fit=crop&q=80' },
  { nom: 'Pose gel', prix: 65, duree: 60, imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&h=200&fit=crop&q=80' },
];

const MASSAGE_SERVICES: DemoService[] = [
  { nom: 'Massage relaxant', prix: 80, duree: 60, badge: 'Populaire', imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=200&fit=crop&q=80' },
  { nom: 'Massage sportif', prix: 90, duree: 60, imageUrl: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=300&h=200&fit=crop&q=80' },
  { nom: 'Massage duo', prix: 150, duree: 90, imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=300&h=200&fit=crop&q=80' },
];

export const DEMO_PROS: DemoPro[] = [
  {
    id: 'pro-1',
    prenom: 'Studio Blade',
    nom: '',
    initials: 'SB',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    coverGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    coverUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=500&fit=crop&q=80',
    categorie: 'barber',
    ville: 'Lausanne',
    note: 4.9,
    avis: 127,
    slogan: 'L\'art du degrade parfait',
    bio: 'Specialiste du degrade et des coupes modernes depuis 8 ans. Chaque coupe est une oeuvre d\'art taillee avec precision.',
    flashActif: true,
    isFlash: true,
    hasRevolut: true,
    revolutHandle: '@studioblade',
    responseTime: '2 min',
    acceptanceRate: 98,
    serviceCount: 5,
    startingPrice: 35,
    flashResponseTime: '< 5 min',
    services: BARBER_SERVICES,
    reviews: [
      { auteur: 'Marc D.', note: 5, texte: 'Meilleur barbier de Lausanne, sans hesitation.', date: 'Il y a 2 jours' },
      { auteur: 'Thomas R.', note: 5, texte: 'Degrade impeccable, je reviens chaque mois.', date: 'Il y a 1 semaine' },
    ],
    galleryGradients: ['linear-gradient(135deg,#1a1a2e,#16213e)', 'linear-gradient(135deg,#0f3460,#533483)', 'linear-gradient(135deg,#e94560,#0f3460)'],
  },
  {
    id: 'pro-2',
    prenom: 'Karim Cuts',
    nom: '',
    initials: 'KC',
    gradient: 'linear-gradient(135deg, #0f3460 0%, #533483 100%)',
    coverGradient: 'linear-gradient(135deg, #0f3460 0%, #533483 100%)',
    coverUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=500&fit=crop&q=80',
    categorie: 'barber',
    ville: 'Geneve',
    note: 4.8,
    avis: 89,
    slogan: 'Precision et style',
    bio: 'Barbier professionnel forme a Londres. Specialiste des coupes afro et des styles contemporains.',
    flashActif: true,
    isFlash: true,
    hasRevolut: true,
    revolutHandle: '@karimcuts',
    responseTime: '5 min',
    acceptanceRate: 95,
    serviceCount: 5,
    startingPrice: 35,
    flashResponseTime: '< 10 min',
    services: BARBER_SERVICES,
    reviews: [
      { auteur: 'Kevin M.', note: 5, texte: 'Top niveau, je recommande vivement.', date: 'Il y a 3 jours' },
    ],
    galleryGradients: ['linear-gradient(135deg,#0f3460,#533483)', 'linear-gradient(135deg,#533483,#e94560)', 'linear-gradient(135deg,#1a1a2e,#0f3460)'],
  },
  {
    id: 'pro-3',
    prenom: 'Tom Barber',
    nom: '',
    initials: 'TB',
    gradient: 'linear-gradient(135deg, #2d1b69 0%, #11998e 100%)',
    coverGradient: 'linear-gradient(135deg, #2d1b69 0%, #11998e 100%)',
    coverUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=500&fit=crop&q=80',
    categorie: 'barber',
    ville: 'Fribourg',
    note: 4.7,
    avis: 54,
    slogan: 'Coupes modernes, style unique',
    bio: 'Barbier independant passione par les nouvelles tendances. Chaque client repart avec une coupe sur mesure.',
    flashActif: false,
    isFlash: false,
    hasRevolut: false,
    revolutHandle: '',
    responseTime: '15 min',
    acceptanceRate: 90,
    serviceCount: 4,
    startingPrice: 30,
    flashResponseTime: '< 20 min',
    services: BARBER_SERVICES.slice(0, 4),
    reviews: [
      { auteur: 'Luca B.', note: 5, texte: 'Super coupe, ambiance sympa.', date: 'Il y a 1 semaine' },
    ],
    galleryGradients: ['linear-gradient(135deg,#2d1b69,#11998e)', 'linear-gradient(135deg,#11998e,#38ef7d)', 'linear-gradient(135deg,#2d1b69,#38ef7d)'],
  },
  {
    id: 'pro-4',
    prenom: 'Elise Coiffure',
    nom: '',
    initials: 'EC',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    coverGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    coverUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=500&fit=crop&q=80',
    categorie: 'coiffure',
    ville: 'Geneve',
    note: 4.9,
    avis: 203,
    slogan: 'Sublimez votre beaute naturelle',
    bio: 'Coiffeuse diplomee avec 12 ans d\'experience. Specialiste des colorations et des coupes feminines tendance.',
    flashActif: true,
    isFlash: true,
    hasRevolut: true,
    revolutHandle: '@elisecoiffure',
    responseTime: '3 min',
    acceptanceRate: 97,
    serviceCount: 4,
    startingPrice: 40,
    flashResponseTime: '< 5 min',
    services: COIFFURE_SERVICES,
    reviews: [
      { auteur: 'Sophie L.', note: 5, texte: 'Elise est une artiste ! Ma couleur est parfaite.', date: 'Il y a 1 jour' },
      { auteur: 'Marie C.', note: 5, texte: 'Toujours au top, je ne vais nulle part ailleurs.', date: 'Il y a 4 jours' },
    ],
    galleryGradients: ['linear-gradient(135deg,#f093fb,#f5576c)', 'linear-gradient(135deg,#4facfe,#00f2fe)', 'linear-gradient(135deg,#f093fb,#4facfe)'],
  },
  {
    id: 'pro-5',
    prenom: 'Sarah Style',
    nom: '',
    initials: 'SS',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    coverGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    coverUrl: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=500&fit=crop&q=80',
    categorie: 'coiffure',
    ville: 'Lausanne',
    note: 4.8,
    avis: 156,
    slogan: 'Votre style, notre passion',
    bio: 'Coiffeuse specialisee dans le brushing et les colorations. Formations regulieres aux dernieres tendances.',
    flashActif: false,
    isFlash: false,
    hasRevolut: true,
    revolutHandle: '@sarahstyle',
    responseTime: '10 min',
    acceptanceRate: 93,
    serviceCount: 4,
    startingPrice: 40,
    flashResponseTime: '< 15 min',
    services: COIFFURE_SERVICES,
    reviews: [
      { auteur: 'Julie P.', note: 5, texte: 'Brushing parfait, je suis ravie !', date: 'Il y a 2 jours' },
    ],
    galleryGradients: ['linear-gradient(135deg,#4facfe,#00f2fe)', 'linear-gradient(135deg,#43e97b,#38f9d7)', 'linear-gradient(135deg,#4facfe,#43e97b)'],
  },
  {
    id: 'pro-6',
    prenom: 'Nadia Beauty',
    nom: '',
    initials: 'NB',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    coverGradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    coverUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=500&fit=crop&q=80',
    categorie: 'esthetique',
    ville: 'Lausanne',
    note: 4.9,
    avis: 178,
    slogan: 'Prenez soin de vous',
    bio: 'Estheticienne certifiee specialisee dans les soins du visage et les techniques anti-age. Produits bio uniquement.',
    flashActif: true,
    isFlash: true,
    hasRevolut: true,
    revolutHandle: '@nadiabeauty',
    responseTime: '4 min',
    acceptanceRate: 96,
    serviceCount: 4,
    startingPrice: 45,
    flashResponseTime: '< 8 min',
    services: ESTHETIQUE_SERVICES,
    reviews: [
      { auteur: 'Camille R.', note: 5, texte: 'Soin du visage incroyable, ma peau est transformee.', date: 'Il y a 1 jour' },
    ],
    galleryGradients: ['linear-gradient(135deg,#fa709a,#fee140)', 'linear-gradient(135deg,#a18cd1,#fbc2eb)', 'linear-gradient(135deg,#fa709a,#a18cd1)'],
  },
  {
    id: 'pro-7',
    prenom: 'Clara Nails',
    nom: '',
    initials: 'CN',
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    coverGradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    coverUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=500&fit=crop&q=80',
    categorie: 'esthetique',
    ville: 'Neuchatel',
    note: 4.7,
    avis: 92,
    slogan: 'Des ongles parfaits, toujours',
    bio: 'Specialiste nail art et pose de gel. Formations internationales, materiel professionnel haut de gamme.',
    flashActif: false,
    isFlash: false,
    hasRevolut: false,
    revolutHandle: '',
    responseTime: '20 min',
    acceptanceRate: 88,
    serviceCount: 4,
    startingPrice: 45,
    flashResponseTime: '< 25 min',
    services: ESTHETIQUE_SERVICES,
    reviews: [
      { auteur: 'Lea M.', note: 5, texte: 'Pose gel impeccable, tient super bien.', date: 'Il y a 3 jours' },
    ],
    galleryGradients: ['linear-gradient(135deg,#a18cd1,#fbc2eb)', 'linear-gradient(135deg,#fbc2eb,#ffecd2)', 'linear-gradient(135deg,#a18cd1,#ffecd2)'],
  },
  {
    id: 'pro-8',
    prenom: 'Zen by Marco',
    nom: '',
    initials: 'ZM',
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    coverGradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    coverUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=500&fit=crop&q=80',
    categorie: 'massage',
    ville: 'Geneve',
    note: 4.9,
    avis: 145,
    slogan: 'Detente et bien-etre absolu',
    bio: 'Masseur therapeute certifie. Techniques suedoises, sportives et relaxantes. Ambiance zen garantie.',
    flashActif: true,
    isFlash: true,
    hasRevolut: true,
    revolutHandle: '@zenbymarco',
    responseTime: '3 min',
    acceptanceRate: 99,
    serviceCount: 3,
    startingPrice: 80,
    flashResponseTime: '< 5 min',
    services: MASSAGE_SERVICES,
    reviews: [
      { auteur: 'Antoine V.', note: 5, texte: 'Massage exceptionnel, je me sens renove.', date: 'Il y a 2 jours' },
      { auteur: 'Claire B.', note: 5, texte: 'Marco est un vrai professionnel, ambiance parfaite.', date: 'Il y a 5 jours' },
    ],
    galleryGradients: ['linear-gradient(135deg,#11998e,#38ef7d)', 'linear-gradient(135deg,#38ef7d,#43e97b)', 'linear-gradient(135deg,#11998e,#43e97b)'],
  },
];

export const CITIES = ['Lausanne', 'Geneve', 'Fribourg', 'Neuchatel', 'Berne', 'Zurich'];
export const SWISS_CITIES = CITIES;
export const CATEGORIES = ['barber', 'coiffure', 'esthetique', 'massage'];
export const CATEGORY_EMOJIS: Record<string, string> = {
  barber: 'B',
  coiffure: 'C',
  esthetique: 'E',
  massage: 'M',
};
export const FILTER_CATEGORIES = ['Tous', 'Barber', 'Coiffure', 'Esthetique', 'Massage'];

export const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Nouvelle reservation', body: 'Marc D. a reserve une coupe pour demain 14h', time: 'Il y a 5 min', read: false },
  { id: '2', title: 'Paiement recu', body: 'Vous avez recu 45 CHF pour la prestation de ce matin', time: 'Il y a 2h', read: false },
  { id: '3', title: 'Avis client', body: 'Thomas R. vous a laisse un avis 5 etoiles', time: 'Il y a 1 jour', read: true },
];

export const WALLET_TRANSACTIONS = [
  { label: 'Coupe homme - Marc D.', amount: 35, type: 'credit', date: 'Aujourd\'hui' },
  { label: 'Degrade premium - Kevin L.', amount: 45, type: 'credit', date: 'Hier' },
  { label: 'Virement compte', amount: 80, type: 'debit', date: 'Il y a 3 jours' },
];

export const WALLET_CHART_DATA = [20, 45, 30, 60, 40, 75, 55];
