import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Splash from './Splash';
import RoleSelection from './RoleSelection';
import Explorer from './Explorer';
import ProviderDetail from './ProviderDetail';
import BookingFlow from './BookingFlow';
import ClientDashboard from './ClientDashboard';
import NexusOS from './NexusOS';
import Builder from './Builder';
import SubscriptionScreen from './SubscriptionScreen';

export default function ScreenRouter() {
  const { currentScreen, navigate } = useAppContext();
  const [showSubscription, setShowSubscription] = useState(false);

  if (showSubscription) {
    return <SubscriptionScreen onBack={() => setShowSubscription(false)} />;
  }

  switch (currentScreen) {
    case 'splash':
      return <Splash />;
    case 'landing':
      return <Splash />;
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
    case 'subscription':
      return <SubscriptionScreen onBack={() => navigate('builder')} />;
    default:
      return <Splash />;
  }
}
