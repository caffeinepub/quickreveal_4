export type DemoProProfile = {
  id: string;
  brandName: string;
  slogan: string;
  bio: string;
  category: string;
  city: string;
  rating: number;
  reviewCount: number;
  isFlashActive: boolean;
  coverImage: string;
  profileImage: string;
  startingPrice: number;
  responseTime: string;
  services: Array<{
    id: string;
    name: string;
    price: number;
    duration: number;
    badges: string[];
  }>;
  languages: string[];
  radius: number;
  atHomeService: boolean;
};

export const DEMO_PROFILES: DemoProProfile[] = [
  {
    id: 'demo-1',
    brandName: 'Studio Blade',
    slogan: 'Le barbier de référence à Lausanne',
    bio: 'Barbier professionnel avec 8 ans d\'expérience. Spécialisé dans les coupes modernes et les dégradés précis. Je me déplace chez vous pour une expérience premium.',
    category: 'Barber',
    city: 'Lausanne',
    rating: 4.9,
    reviewCount: 47,
    isFlashActive: true,
    coverImage: '/assets/generated/barber-lausanne-cover.dim_1200x400.png',
    profileImage: '/assets/generated/provider-julien-rossi.dim_800x600.png',
    startingPrice: 35,
    responseTime: '3 min',
    services: [
      { id: 's1', name: 'Coupe homme', price: 35, duration: 30, badges: ['Populaire'] },
      { id: 's2', name: 'Barbe', price: 25, duration: 20, badges: [] },
      { id: 's3', name: 'Coupe + Barbe', price: 55, duration: 45, badges: ['Populaire'] },
      { id: 's4', name: 'Dégradé', price: 45, duration: 40, badges: [] },
      { id: 's5', name: 'Rasage traditionnel', price: 40, duration: 30, badges: ['Nouveau'] },
    ],
    languages: ['FR', 'EN'],
    radius: 15,
    atHomeService: true,
  },
  {
    id: 'demo-2',
    brandName: 'BarberKing Geneva',
    slogan: 'Coupes premium au cœur de Genève',
    bio: 'Expert en coiffure masculine depuis 12 ans. Techniques modernes et classiques maîtrisées. Votre style, notre passion.',
    category: 'Barber',
    city: 'Genève',
    rating: 4.7,
    reviewCount: 32,
    isFlashActive: false,
    coverImage: '/assets/generated/barber-geneva-cover.dim_1200x400.png',
    profileImage: '/assets/generated/provider-mageste-labs.dim_800x600.png',
    startingPrice: 35,
    responseTime: '8 min',
    services: [
      { id: 's1', name: 'Coupe homme', price: 35, duration: 30, badges: ['Populaire'] },
      { id: 's2', name: 'Barbe', price: 25, duration: 20, badges: [] },
      { id: 's3', name: 'Coupe + Barbe', price: 55, duration: 45, badges: ['Populaire'] },
      { id: 's4', name: 'Dégradé', price: 45, duration: 40, badges: [] },
    ],
    languages: ['FR', 'EN', 'AR'],
    radius: 20,
    atHomeService: true,
  },
  {
    id: 'demo-3',
    brandName: 'Studio Élé',
    slogan: 'Coiffure d\'exception à domicile',
    bio: 'Coiffeuse diplômée avec 10 ans d\'expérience dans les plus grands salons genevois. Colorations, mèches et soins capillaires haut de gamme.',
    category: 'Coiffure',
    city: 'Genève',
    rating: 4.8,
    reviewCount: 28,
    isFlashActive: false,
    coverImage: '/assets/generated/coiffure-geneva-cover.dim_1200x400.png',
    profileImage: '/assets/generated/provider-sophiane-hair.dim_800x600.png',
    startingPrice: 50,
    responseTime: '5 min',
    services: [
      { id: 's1', name: 'Coupe femme', price: 50, duration: 45, badges: ['Populaire'] },
      { id: 's2', name: 'Brushing', price: 40, duration: 30, badges: [] },
      { id: 's3', name: 'Coloration', price: 120, duration: 90, badges: ['Populaire'] },
      { id: 's4', name: 'Mèches', price: 150, duration: 120, badges: [] },
      { id: 's5', name: 'Lissage brésilien', price: 200, duration: 180, badges: ['Promo'] },
    ],
    languages: ['FR', 'EN', 'PT'],
    radius: 25,
    atHomeService: true,
  },
  {
    id: 'demo-4',
    brandName: 'Atelier Fribourg Hair',
    slogan: 'Votre beauté, notre art — Fribourg',
    bio: 'Salon mobile de coiffure haut de gamme. Spécialiste des colorations végétales et des soins naturels. Je viens chez vous avec tout le matériel professionnel.',
    category: 'Coiffure',
    city: 'Fribourg',
    rating: 4.6,
    reviewCount: 19,
    isFlashActive: false,
    coverImage: '/assets/generated/coiffure-fribourg-cover.dim_1200x400.png',
    profileImage: '/assets/generated/provider-noura-beauty.dim_800x600.png',
    startingPrice: 50,
    responseTime: '12 min',
    services: [
      { id: 's1', name: 'Coupe femme', price: 50, duration: 45, badges: ['Populaire'] },
      { id: 's2', name: 'Brushing', price: 40, duration: 30, badges: [] },
      { id: 's3', name: 'Coloration', price: 120, duration: 90, badges: ['Populaire'] },
      { id: 's4', name: 'Mèches', price: 150, duration: 120, badges: [] },
    ],
    languages: ['FR', 'DE'],
    radius: 30,
    atHomeService: true,
  },
  {
    id: 'demo-5',
    brandName: 'Glow by Sofia',
    slogan: 'Esthétique premium à domicile — Lausanne',
    bio: 'Esthéticienne certifiée avec 6 ans d\'expérience. Épilations, soins du visage et manucures de qualité professionnelle dans le confort de votre maison.',
    category: 'Esthétique',
    city: 'Lausanne',
    rating: 4.9,
    reviewCount: 41,
    isFlashActive: false,
    coverImage: '/assets/generated/esthetique-lausanne-cover.dim_1200x400.png',
    profileImage: '/assets/generated/provider-lucie-esthetics.dim_800x600.png',
    startingPrice: 20,
    responseTime: '6 min',
    services: [
      { id: 's1', name: 'Épilation sourcils', price: 20, duration: 15, badges: [] },
      { id: 's2', name: 'Épilation jambes', price: 60, duration: 45, badges: ['Populaire'] },
      { id: 's3', name: 'Soin visage', price: 80, duration: 60, badges: ['Populaire'] },
      { id: 's4', name: 'Manucure', price: 50, duration: 45, badges: [] },
      { id: 's5', name: 'Pédicure', price: 60, duration: 60, badges: ['Nouveau'] },
    ],
    languages: ['FR', 'EN', 'ES'],
    radius: 20,
    atHomeService: true,
  },
  {
    id: 'demo-6',
    brandName: 'Zen Touch',
    slogan: 'Massages thérapeutiques à Genève',
    bio: 'Masseur thérapeute diplômé, spécialisé en massage relaxant et sportif. 9 ans d\'expérience. Je me déplace à domicile ou en entreprise pour votre bien-être.',
    category: 'Massage',
    city: 'Genève',
    rating: 4.8,
    reviewCount: 35,
    isFlashActive: false,
    coverImage: '/assets/generated/massage-geneva-cover.dim_1200x400.png',
    profileImage: '/assets/generated/provider-zen-touch.dim_800x600.png',
    startingPrice: 55,
    responseTime: '10 min',
    services: [
      { id: 's1', name: 'Massage relaxant', price: 90, duration: 60, badges: ['Populaire'] },
      { id: 's2', name: 'Massage sportif', price: 100, duration: 60, badges: [] },
      { id: 's3', name: 'Massage dos', price: 55, duration: 30, badges: [] },
      { id: 's4', name: 'Pierres chaudes', price: 120, duration: 75, badges: ['Nouveau'] },
    ],
    languages: ['FR', 'EN'],
    radius: 25,
    atHomeService: true,
  },
];

export function getDemoProfileById(id: string): DemoProProfile | undefined {
  return DEMO_PROFILES.find(p => p.id === id);
}

export function getDemoProfilesByCategory(category: string): DemoProProfile[] {
  return DEMO_PROFILES.filter(p => p.category === category);
}

export function getDemoProfilesByCity(city: string): DemoProProfile[] {
  return DEMO_PROFILES.filter(p => p.city === city);
}

export function getFlashActiveProfiles(): DemoProProfile[] {
  return DEMO_PROFILES.filter(p => p.isFlashActive);
}
