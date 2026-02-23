import React, { useRef, useEffect, useState } from 'react';
import { AppContextProvider, useAppContext, ScreenType } from './context/AppContext';
import Splash from './components/Splash';
import Explorer from './components/Explorer';
import ProviderDetail from './components/ProviderDetail';
import BookingLocation from './components/BookingLocation';
import BookingDate from './components/BookingDate';
import BookingContact from './components/BookingContact';
import ClientLogin from './components/ClientLogin';
import ClientDashboard from './components/ClientDashboard';
import ProLogin from './components/ProLogin';
import NexusOS from './components/NexusOS';
import Builder from './components/Builder';
import Subscription from './components/Subscription';
import SupportChat from './components/SupportChat';

const SCREEN_ORDER: ScreenType[] = [
  'splash',
  'explorer',
  'providerDetail',
  'bookingLocation',
  'bookingDate',
  'bookingContact',
  'clientLogin',
  'clientDashboard',
  'proLogin',
  'nexusOS',
  'builder',
  'subscription',
];

const ScreenRouter: React.FC = () => {
  const { currentScreen } = useAppContext();
  const previousScreenRef = useRef<ScreenType>('splash');
  const [transitionClass, setTransitionClass] = useState('');
  const [displayScreen, setDisplayScreen] = useState<ScreenType>('splash');

  useEffect(() => {
    const prevScreen = previousScreenRef.current;
    const prevIndex = SCREEN_ORDER.indexOf(prevScreen);
    const currIndex = SCREEN_ORDER.indexOf(currentScreen);

    let enterClass = '';
    let exitClass = '';

    if (prevScreen === 'splash' || currentScreen === 'splash') {
      enterClass = 'screen-fade-in';
      exitClass = 'screen-fade-out';
    } else if (currIndex > prevIndex) {
      enterClass = 'screen-enter-forward';
      exitClass = 'screen-exit-forward';
    } else {
      enterClass = 'screen-enter-backward';
      exitClass = 'screen-exit-backward';
    }

    setTransitionClass(exitClass);

    const timer = setTimeout(() => {
      setDisplayScreen(currentScreen);
      setTransitionClass(enterClass);
      previousScreenRef.current = currentScreen;
    }, 300);

    return () => clearTimeout(timer);
  }, [currentScreen]);

  const renderScreen = () => {
    switch (displayScreen) {
      case 'splash':
        return <Splash />;
      case 'explorer':
        return <Explorer />;
      case 'providerDetail':
        return <ProviderDetail />;
      case 'bookingLocation':
        return <BookingLocation />;
      case 'bookingDate':
        return <BookingDate />;
      case 'bookingContact':
        return <BookingContact />;
      case 'clientLogin':
        return <ClientLogin />;
      case 'clientDashboard':
        return <ClientDashboard />;
      case 'proLogin':
        return <ProLogin />;
      case 'nexusOS':
        return <NexusOS />;
      case 'builder':
        return <Builder />;
      case 'subscription':
        return <Subscription />;
      default:
        return <Splash />;
    }
  };

  return <div className={transitionClass}>{renderScreen()}</div>;
};

function App() {
  return (
    <AppContextProvider>
      <ScreenRouter />
      <SupportChat />
    </AppContextProvider>
  );
}

export default App;
