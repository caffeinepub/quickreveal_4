import React from 'react';
import { useAppContext } from '../context/AppContext';
import BottomNav from './BottomNav';
import GlobalHeader from './GlobalHeader';

export default function ProDashboard() {
  // This component is an alias for NexusOS — redirect there
  const { navigateTo } = useAppContext();
  React.useEffect(() => {
    navigateTo('nexusOS');
  }, [navigateTo]);
  return null;
}
