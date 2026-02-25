import React, { createContext, useContext, useState } from 'react';

export interface ProData {
  prenom: string;
  ville: string;
  categorie: string;
  iban: string;
  photos: (string | null)[];
  services: string[];
  flashActif: boolean;
  slogan: string;
  bio: string;
}

interface ProContextType {
  proActif: boolean;
  setProActif: (v: boolean) => void;
  proData: ProData;
  setProData: (d: ProData) => void;
  walletCooldownEnd: number | null;
  setWalletCooldownEnd: (v: number | null) => void;
}

const defaultProData: ProData = {
  prenom: 'Alexandre',
  ville: 'Lausanne',
  categorie: 'barber',
  iban: '',
  photos: [],
  services: [],
  flashActif: false,
  slogan: '',
  bio: '',
};

export const ProContext = createContext<ProContextType>({
  proActif: false,
  setProActif: () => {},
  proData: defaultProData,
  setProData: () => {},
  walletCooldownEnd: null,
  setWalletCooldownEnd: () => {},
});

export function ProProvider({ children }: { children: React.ReactNode }) {
  const [proActif, setProActif] = useState(false);
  const [proData, setProData] = useState<ProData>(defaultProData);
  const [walletCooldownEnd, setWalletCooldownEnd] = useState<number | null>(null);

  return (
    <ProContext.Provider value={{ proActif, setProActif, proData, setProData, walletCooldownEnd, setWalletCooldownEnd }}>
      {children}
    </ProContext.Provider>
  );
}

export function useProContext() {
  return useContext(ProContext);
}
