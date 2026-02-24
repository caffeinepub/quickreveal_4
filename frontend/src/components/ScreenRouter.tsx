import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import Splash from './Splash';
import Explorer from './Explorer';
import ProviderDetail from './ProviderDetail';
import BookingFlow from './BookingFlow';
import ClientDashboard from './ClientDashboard';
import NexusOS from './NexusOS';
import Builder from './Builder';
import LandingPage from './LandingPage';
import RoleSelection from './RoleSelection';

export default function ScreenRouter() {
  const { currentScreen } = useAppContext();
  const [displayScreen, setDisplayScreen] = useState(currentScreen);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (currentScreen !== displayScreen) {
      setOpacity(0);
      const timer = setTimeout(() => {
        setDisplayScreen(currentScreen);
        setOpacity(1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, displayScreen]);

  const renderScreen = () => {
    switch (displayScreen) {
      case 'splash':
        return <Splash />;
      case 'landing':
        return <LandingPage />;
      case 'roleSelection':
        return <RoleSelection />;
      case 'explorer':
        return <Explorer />;
      case 'providerDetail':
        return <ProviderDetail />;
      case 'bookingFlow':
        return <BookingFlow />;
      case 'clientDashboard':
        return <ClientDashboard />;
      case 'nexusOS':
        return <NexusOS />;
      case 'builder':
        return <Builder />;
      default:
        return <Splash />;
    }
  };

  return (
    <div style={{ opacity, transition: 'opacity 200ms ease-out' }}>
      {renderScreen()}
    </div>
  );
}
