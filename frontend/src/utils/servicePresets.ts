export type ServicePreset = {
  id: string;
  name: string;
  price: number;
  duration: number;
  badges: string[];
};

export const SERVICE_PRESETS: Record<string, ServicePreset[]> = {
  Barber: [
    { id: 'barber-1', name: 'Coupe homme', price: 35, duration: 30, badges: ['Populaire'] },
    { id: 'barber-2', name: 'Barbe', price: 25, duration: 20, badges: [] },
    { id: 'barber-3', name: 'Coupe + Barbe', price: 55, duration: 45, badges: ['Populaire'] },
    { id: 'barber-4', name: 'Dégradé', price: 45, duration: 40, badges: [] },
    { id: 'barber-5', name: 'Rasage traditionnel', price: 40, duration: 30, badges: ['Nouveau'] },
  ],
  Coiffure: [
    { id: 'coiffure-1', name: 'Coupe femme', price: 50, duration: 45, badges: ['Populaire'] },
    { id: 'coiffure-2', name: 'Brushing', price: 40, duration: 30, badges: [] },
    { id: 'coiffure-3', name: 'Coloration', price: 120, duration: 90, badges: ['Populaire'] },
    { id: 'coiffure-4', name: 'Mèches', price: 150, duration: 120, badges: [] },
    { id: 'coiffure-5', name: 'Lissage brésilien', price: 200, duration: 180, badges: ['Promo'] },
  ],
  Esthétique: [
    { id: 'esth-1', name: 'Épilation sourcils', price: 20, duration: 15, badges: [] },
    { id: 'esth-2', name: 'Épilation jambes', price: 60, duration: 45, badges: ['Populaire'] },
    { id: 'esth-3', name: 'Soin visage', price: 80, duration: 60, badges: ['Populaire'] },
    { id: 'esth-4', name: 'Manucure', price: 50, duration: 45, badges: [] },
    { id: 'esth-5', name: 'Pédicure', price: 60, duration: 60, badges: ['Nouveau'] },
  ],
  Massage: [
    { id: 'massage-1', name: 'Massage relaxant', price: 90, duration: 60, badges: ['Populaire'] },
    { id: 'massage-2', name: 'Massage sportif', price: 100, duration: 60, badges: [] },
    { id: 'massage-3', name: 'Massage dos', price: 55, duration: 30, badges: [] },
    { id: 'massage-4', name: 'Pierres chaudes', price: 120, duration: 75, badges: ['Nouveau'] },
  ],
};

export const CATEGORIES = ['Barber', 'Coiffure', 'Esthétique', 'Massage'] as const;
export type Category = (typeof CATEGORIES)[number];
