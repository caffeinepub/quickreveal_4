import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const Subscription: React.FC = () => {
  const { navigate } = useAppContext();

  useEffect(() => {
    navigate('subscription');
  }, [navigate]);

  return null;
};

export default Subscription;
