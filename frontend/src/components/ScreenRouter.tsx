import React, { Suspense, lazy, useState } from 'react';
import { useAppContext } from '../context/AppContext';

// Lazy imports
const Splash = lazy(() => import('./Splash'));
const LandingPage = lazy(() => import('./LandingPage'));
const Login = lazy(() => import('./Login'));
const ProLogin = lazy(() => import('./ProLogin'));
const RoleSelection = lazy(() => import('./RoleSelection'));
const RoleSelectionV2 = lazy(() => import('./RoleSelectionV2'));
const OTPVerification = lazy(() => import('./OTPVerification'));
const OTPVerificationV2 = lazy(() => import('./OTPVerificationV2'));
const Welcome = lazy(() => import('./Welcome'));
const ExplorerV2 = lazy(() => import('./ExplorerV2'));
const ProFiche = lazy(() => import('./ProFiche'));
const BookingFlow = lazy(() => import('./BookingFlow'));
const LiveStatus = lazy(() => import('./LiveStatus'));
const ClientDashboard = lazy(() => import('./ClientDashboard'));
const NexusOS = lazy(() => import('./NexusOS'));
const ProApp = lazy(() => import('./ProApp'));
const Builder = lazy(() => import('./Builder'));
const Subscription = lazy(() => import('./Subscription'));
const SubscriptionScreen = lazy(() => import('./SubscriptionScreen'));
const AdminPanel = lazy(() => import('./AdminPanel'));
const NotificationCenter = lazy(() => import('./NotificationCenter'));

// MessagingSheet wrapper — provides required isOpen/onClose props
const MessagingSheetWrapper = lazy(() =>
  import('./MessagingSheet').then((mod) => ({
    default: function MessagingSheetScreen() {
      const [open, setOpen] = useState(true);
      const { navigateTo } = useAppContext();
      const Comp = mod.default;
      return (
        <Comp
          isOpen={open}
          onClose={() => {
            setOpen(false);
            navigateTo('nexusOS');
          }}
        />
      );
    },
  }))
);

const Fallback = () => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      background: '#050507',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <span
      style={{
        width: 32,
        height: 32,
        border: '3px solid rgba(242,208,107,0.2)',
        borderTopColor: '#F2D06B',
        borderRadius: '50%',
        display: 'inline-block',
        animation: 'spin 0.8s linear infinite',
      }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default function ScreenRouter() {
  const { currentScreen } = useAppContext();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':              return <Splash />;
      case 'landing':             return <LandingPage />;
      case 'login':               return <Login />;
      case 'proLogin':            return <ProLogin />;
      case 'roleSelection':       return <RoleSelection />;
      case 'roleSelectionV2':     return <RoleSelectionV2 />;
      case 'otpVerification':     return <OTPVerification />;
      case 'otpVerificationV2':   return <OTPVerificationV2 />;
      case 'clientOtp':           return <OTPVerificationV2 />;
      case 'otp':                 return <OTPVerification />;
      case 'welcome':             return <Welcome />;
      case 'explorerV2':          return <ExplorerV2 />;
      case 'explorer':            return <ExplorerV2 />;
      case 'proFiche':            return <ProFiche />;
      case 'providerDetail':      return <ProFiche />;
      case 'bookingFlow':         return <BookingFlow />;
      case 'bookingLocation':     return <BookingFlow />;
      case 'bookingDate':         return <BookingFlow />;
      case 'bookingContact':      return <BookingFlow />;
      case 'liveStatus':          return <LiveStatus />;
      case 'clientDashboard':     return <ClientDashboard />;
      case 'nexusOS':             return <NexusOS />;
      case 'monBusiness':         return <NexusOS />;
      case 'proOnboarding':       return <ProApp />;
      case 'proSuccess':          return <ProApp />;
      case 'radarPro':            return <ProApp />;
      case 'walletPro':           return <ProApp />;
      case 'builder':             return <Builder />;
      case 'subscription':        return <Subscription />;
      case 'subscriptionScreen':  return <SubscriptionScreen />;
      case 'subscriptionSuccess': return <NexusOS />;
      case 'subscriptionModal':   return <NexusOS />;
      case 'upgradeModal':        return <NexusOS />;
      case 'messaging':           return <MessagingSheetWrapper />;
      case 'admin':               return <AdminPanel />;
      case 'notificationCenter':  return <NotificationCenter />;
      default:                    return <Splash />;
    }
  };

  return (
    <Suspense fallback={<Fallback />}>
      {renderScreen()}
    </Suspense>
  );
}
