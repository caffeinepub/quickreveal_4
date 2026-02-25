export type { DemoPro, DemoService } from '../utils/demoData';
export { DEMO_PROS } from '../utils/demoData';

export const DEMO_WALLET = {
  solde: 240,
  sequestre: 55,
  graphique: [40, 65, 55, 90, 110, 80, 20],
  jours: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  transactions: [
    { nom: 'Thomas M.', montant: 55, type: 'entree', date: "Aujourd hui 10:00" },
    { nom: 'Lucas B.', montant: 45, type: 'entree', date: "Aujourd hui 13:30" },
    { nom: 'Antoine R.', montant: 40, type: 'entree', date: "Hier 16:00" },
    { nom: 'Mehdi A.', montant: 35, type: 'entree', date: "Hier 11:00" },
    { nom: 'Julien P.', montant: 30, type: 'entree', date: "Lun 14:30" },
    { nom: 'Virement IBAN', montant: -65, type: 'sortie', date: "Lun 09:00" },
  ],
};

export const DEMO_RADAR = {
  enAttente: [
    { id: 'req-1', clientPrenom: 'Thomas', clientNom: 'M.', clientInitials: 'TM', note: 4.9, distance: 0.8, service: 'Coupe + Barbe', montant: 55, expiresIn: 228 },
    { id: 'req-2', clientPrenom: 'Lucas', clientNom: 'B.', clientInitials: 'LB', note: 4.7, distance: 1.2, service: 'Degrade premium', montant: 45, expiresIn: 408 },
    { id: 'req-3', clientPrenom: 'Julien', clientNom: 'P.', clientInitials: 'JP', note: 4.6, distance: 0.6, service: 'Degrade', montant: 45, expiresIn: 0 },
  ],
  confirmees: [
    {
      id: 'conf-1',
      clientPrenom: 'Lucas',
      clientNom: 'B.',
      clientInitials: 'LB',
      service: 'Degrade premium',
      montant: 45,
      messages: [
        { from: 'client', text: 'Bonjour ! Je confirme mon rendez-vous. Je serai la a l heure.', time: '10:02' },
        { from: 'pro', text: 'Parfait ! Je serai pret. Avez-vous une preference particuliere pour la coupe ?', time: '10:04' },
        { from: 'client', text: 'Oui, un degrade classique avec les cotes courts s il vous plait.', time: '10:05' },
      ],
    },
    { id: 'conf-2', clientPrenom: 'Thomas', clientNom: 'M.', clientInitials: 'TM', service: 'Coupe + Barbe', montant: 55, messages: [] },
    { id: 'conf-3', clientPrenom: 'Antoine', clientNom: 'R.', clientInitials: 'AR', service: 'Rasage traditionnel', montant: 40, messages: [] },
    { id: 'conf-4', clientPrenom: 'Mehdi', clientNom: 'A.', clientInitials: 'MA', service: 'Coupe homme', montant: 35, messages: [] },
  ],
  historique: [
    { clientPrenom: 'Mehdi', clientNom: 'A.', clientInitials: 'MA', service: 'Coupe homme', statut: 'fait' },
    { clientPrenom: 'Julien', clientNom: 'P.', clientInitials: 'JP', service: 'Barbe design', statut: 'decline' },
  ],
};
