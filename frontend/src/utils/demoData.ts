export interface DemoService {
  id: string;
  nom: string;
  prix: number;
  duree: number;
  badge: string | null;
  description: string;
  imageUrl?: string;
}

export interface DemoPro {
  id: string;
  prenom: string;
  nom: string;
  initials: string;
  categorie: string;
  ville: string;
  flashActif: boolean;
  note: number;
  nbAvis: number;
  reponseMins?: number;
  acceptation?: number;
  nbPrestations?: number;
  slogan?: string;
  bio?: string;
  prixDepuis: number;
  gradient: string;
  coverUrl: string;
  services?: DemoService[];
}

const BARBER_SERVICES: DemoService[] = [
  {
    id: 'coupe-homme',
    nom: 'Coupe homme',
    prix: 35,
    duree: 30,
    badge: 'populaire',
    description: 'Coupe classique ou moderne adaptee a votre style',
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&h=200&fit=crop&q=80',
  },
  {
    id: 'degrade-premium',
    nom: 'Degrade premium',
    prix: 45,
    duree: 45,
    badge: 'populaire',
    description: 'Degrade precis avec finitions impeccables',
    imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300&h=200&fit=crop&q=80',
  },
  {
    id: 'coupe-barbe',
    nom: 'Coupe + Barbe',
    prix: 55,
    duree: 60,
    badge: null,
    description: 'Coupe complete avec taille et mise en forme de la barbe',
    imageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=300&h=200&fit=crop&q=80',
  },
  {
    id: 'barbe-design',
    nom: 'Barbe design',
    prix: 30,
    duree: 30,
    badge: null,
    description: 'Taille et sculpture de barbe sur mesure',
    imageUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=200&fit=crop&q=80',
  },
  {
    id: 'rasage-traditionnel',
    nom: 'Rasage traditionnel',
    prix: 40,
    duree: 45,
    badge: 'nouveau',
    description: 'Rasage au coupe-chou avec serviette chaude',
    imageUrl: 'https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=300&h=200&fit=crop&q=80',
  },
];

const COIFFURE_SERVICES: DemoService[] = [
  {
    id: 'coupe-femme',
    nom: 'Coupe femme',
    prix: 55,
    duree: 45,
    badge: 'populaire',
    description: 'Coupe et coiffage adaptes a votre morphologie',
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&h=200&fit=crop&q=80',
  },
  {
    id: 'couleur',
    nom: 'Couleur',
    prix: 90,
    duree: 90,
    badge: null,
    description: 'Coloration complete avec produits professionnels',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=200&fit=crop&q=80',
  },
  {
    id: 'meches',
    nom: 'Meches',
    prix: 110,
    duree: 120,
    badge: null,
    description: 'Balayage ou meches pour un effet naturel lumineux',
    imageUrl: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=300&h=200&fit=crop&q=80',
  },
  {
    id: 'brushing',
    nom: 'Brushing',
    prix: 45,
    duree: 30,
    badge: 'populaire',
    description: 'Brushing professionnel pour un resultat parfait',
    imageUrl: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=300&h=200&fit=crop&q=80',
  },
];

const ESTHETIQUE_SERVICES: DemoService[] = [
  {
    id: 'soin-visage',
    nom: 'Soin visage',
    prix: 70,
    duree: 60,
    badge: 'populaire',
    description: 'Soin hydratant et purifiant adapte a votre peau',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&h=200&fit=crop&q=80',
  },
  {
    id: 'manucure',
    nom: 'Manucure',
    prix: 40,
    duree: 45,
    badge: null,
    description: 'Soin complet des mains et pose de vernis',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&h=200&fit=crop&q=80',
  },
  {
    id: 'pedicure',
    nom: 'Pedicure',
    prix: 50,
    duree: 60,
    badge: null,
    description: 'Soin complet des pieds et pose de vernis',
    imageUrl: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=300&h=200&fit=crop&q=80',
  },
  {
    id: 'pose-gel',
    nom: 'Pose gel',
    prix: 60,
    duree: 75,
    badge: 'populaire',
    description: 'Pose de gel longue duree avec finition parfaite',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&h=200&fit=crop&q=80',
  },
];

const MASSAGE_SERVICES: DemoService[] = [
  {
    id: 'massage-relaxant',
    nom: 'Massage relaxant',
    prix: 80,
    duree: 60,
    badge: 'populaire',
    description: 'Massage suedois pour une detente profonde',
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=200&fit=crop&q=80',
  },
  {
    id: 'massage-sportif',
    nom: 'Massage sportif',
    prix: 90,
    duree: 60,
    badge: null,
    description: 'Massage decontracturant pour sportifs',
    imageUrl: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=300&h=200&fit=crop&q=80',
  },
  {
    id: 'massage-duo',
    nom: 'Massage duo',
    prix: 150,
    duree: 60,
    badge: 'nouveau',
    description: 'Massage en couple dans une ambiance zen',
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=300&h=200&fit=crop&q=80',
  },
];

export const DEMO_PROS: DemoPro[] = [
  {
    id: 'studio-blade',
    prenom: 'Studio',
    nom: 'Blade',
    initials: 'SB',
    categorie: 'barber',
    ville: 'Lausanne',
    flashActif: true,
    note: 4.9,
    nbAvis: 47,
    reponseMins: 3,
    acceptation: 97,
    nbPrestations: 124,
    slogan: "L art de la coupe parfaite",
    bio: "Expert en degrade depuis 8 ans. Specialiste des coupes modernes et classiques.",
    prixDepuis: 35,
    gradient: 'linear-gradient(135deg, #0A0614, #180B2E)',
    coverUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=500&fit=crop&q=80',
    services: BARBER_SERVICES,
  },
  {
    id: 'karim-cuts',
    prenom: 'Karim',
    nom: 'Cuts',
    initials: 'KC',
    categorie: 'barber',
    ville: 'Geneve',
    flashActif: false,
    note: 4.8,
    nbAvis: 89,
    reponseMins: 8,
    prixDepuis: 40,
    gradient: 'linear-gradient(135deg, #060A14, #0B1428)',
    coverUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=500&fit=crop&q=80',
    services: BARBER_SERVICES,
  },
  {
    id: 'tom-barber',
    prenom: 'Tom',
    nom: 'Barber',
    initials: 'TB',
    categorie: 'barber',
    ville: 'Fribourg',
    flashActif: true,
    note: 4.7,
    nbAvis: 31,
    reponseMins: 10,
    prixDepuis: 28,
    gradient: 'linear-gradient(135deg, #040E08, #0B2016)',
    coverUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=500&fit=crop&q=80',
    services: BARBER_SERVICES,
  },
  {
    id: 'elise-coiffure',
    prenom: 'Elise',
    nom: 'Coiffure',
    initials: 'EC',
    categorie: 'coiffure',
    ville: 'Geneve',
    flashActif: false,
    note: 4.9,
    nbAvis: 94,
    reponseMins: 5,
    prixDepuis: 55,
    gradient: 'linear-gradient(135deg, #140608, #2A0C10)',
    coverUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=500&fit=crop&q=80',
    services: COIFFURE_SERVICES,
  },
  {
    id: 'sarah-style',
    prenom: 'Sarah',
    nom: 'Style',
    initials: 'SS',
    categorie: 'coiffure',
    ville: 'Lausanne',
    flashActif: false,
    note: 4.6,
    nbAvis: 28,
    prixDepuis: 45,
    gradient: 'linear-gradient(135deg, #0A0614, #1A0828)',
    coverUrl: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=500&fit=crop&q=80',
    services: COIFFURE_SERVICES,
  },
  {
    id: 'nadia-beauty',
    prenom: 'Nadia',
    nom: 'Beauty',
    initials: 'NB',
    categorie: 'esthetique',
    ville: 'Lausanne',
    flashActif: true,
    note: 4.8,
    nbAvis: 52,
    reponseMins: 7,
    prixDepuis: 60,
    gradient: 'linear-gradient(135deg, #140A06, #281408)',
    coverUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=500&fit=crop&q=80',
    services: ESTHETIQUE_SERVICES,
  },
  {
    id: 'clara-nails',
    prenom: 'Clara',
    nom: 'Nails',
    initials: 'CN',
    categorie: 'esthetique',
    ville: 'Neuchatel',
    flashActif: false,
    note: 4.7,
    nbAvis: 19,
    prixDepuis: 40,
    gradient: 'linear-gradient(135deg, #06060E, #0C0C1E)',
    coverUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=500&fit=crop&q=80',
    services: ESTHETIQUE_SERVICES,
  },
  {
    id: 'zen-marco',
    prenom: 'Zen by',
    nom: 'Marco',
    initials: 'ZM',
    categorie: 'massage',
    ville: 'Geneve',
    flashActif: false,
    note: 4.9,
    nbAvis: 73,
    reponseMins: 6,
    prixDepuis: 80,
    gradient: 'linear-gradient(135deg, #040A14, #081828)',
    coverUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=500&fit=crop&q=80',
    services: MASSAGE_SERVICES,
  },
];
