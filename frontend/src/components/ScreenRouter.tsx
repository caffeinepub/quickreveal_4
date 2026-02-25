import React, { Suspense, lazy } from 'react';
import { useAppContext } from '../context/AppContext';
import SMSToast from './SMSToast';

const Login = lazy(() => import('./Login'));
const RoleSelectionV2 = lazy(() => import('./RoleSelectionV2'));
const OTPVerificationV2 = lazy(() => import('./OTPVerificationV2'));
const ExplorerV2 = lazy(() => import('./ExplorerV2'));
const ProFiche = lazy(() => import('./ProFiche'));
const BookingFlow = lazy(() => import('./BookingFlow'));
const SubscriptionModal = lazy(() => import('./SubscriptionModal'));
const MonBusiness = lazy(() => import('./MonBusiness'));
const LiveStatus = lazy(() => import('./LiveStatus'));
const ClientDashboard = lazy(() => import('./ClientDashboard'));
const NexusOS = lazy(() => import('./NexusOS'));
const NotificationCenter = lazy(() => import('./NotificationCenter'));
const Splash = lazy(() => import('./Splash'));
const Welcome = lazy(() => import('./Welcome'));
const RoleSelection = lazy(() => import('./RoleSelection'));
const OTPVerification = lazy(() => import('./OTPVerification'));
const Explorer = lazy(() => import('./Explorer'));
const ProviderDetail = lazy(() => import('./ProviderDetail'));
const BookingLocation = lazy(() => import('./BookingLocation'));
const BookingDate = lazy(() => import('./BookingDate'));
const BookingContact = lazy(() => import('./BookingContact'));
const Subscription = lazy(() => import('./Subscription'));
const Builder = lazy(() => import('./Builder'));
const ProLogin = lazy(() => import('./ProLogin'));
const UpgradeModal = lazy(() => import('./UpgradeModal'));
const SubscriptionScreen = lazy(() => import('./SubscriptionScreen'));
const ProOnboardingModal = lazy(() => import('./ProOnboardingModal'));

function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'var(--void)',
    }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  );
}

export default function ScreenRouter() {
  const { currentScreen, smsToast, goBack, hideSMSToast, closeSubscriptionModal } = useAppContext();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login': return <Login />;
      case 'roleSelectionV2': return <RoleSelectionV2 />;
      case 'roleSelection': return <RoleSelectionV2 />;
      case 'clientOtp': return <OTPVerificationV2 />;
      case 'otp': return <OTPVerification />;
      case 'otpVerification': return <OTPVerification />;
      case 'proOnboarding': return <ProOnboardingModal onClose={goBack} />;
      case 'explorerV2': return <ExplorerV2 />;
      case 'proFiche': return <ProFiche />;
      case 'bookingFlow': return <BookingFlow />;
      case 'subscriptionModal': return <SubscriptionModal />;
      // proSuccess and subscriptionSuccess are handled inside ProLayout/BusinessScreen
      // Redirect to nexusOS which contains the full pro space
      case 'proSuccess': return <NexusOS />;
      case 'subscriptionSuccess': return <NexusOS />;
      case 'monBusiness': return <MonBusiness />;
      case 'liveStatus': return <LiveStatus />;
      case 'clientDashboard': return <ClientDashboard />;
      case 'nexusOS': return <NexusOS />;
      case 'radarPro': return <NexusOS />;
      case 'walletPro': return <NexusOS />;
      case 'notificationCenter': return <NotificationCenter />;
      case 'splash': return <Splash />;
      case 'welcome': return <Welcome />;
      case 'explorer': return <Explorer />;
      case 'providerDetail': return <ProviderDetail />;
      case 'bookingLocation': return <BookingLocation />;
      case 'bookingDate': return <BookingDate />;
      case 'bookingContact': return <BookingContact />;
      case 'subscription': return <Subscription />;
      case 'builder': return <Builder />;
      case 'proLogin': return <ProLogin />;
      case 'upgradeModal': return <UpgradeModal onClose={goBack} />;
      case 'subscriptionScreen': return <SubscriptionScreen />;
      default: return <Login />;
    }
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      {renderScreen()}
      <SMSToast
        visible={smsToast.visible}
        message={smsToast.message}
        phone={smsToast.phone}
        onDismiss={hideSMSToast}
      />
    </Suspense>
  );
}
