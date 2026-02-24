import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const LandingPage: React.FC = () => {
  const { navigate } = useAppContext();

  useEffect(() => {
    navigate('splash');
  }, [navigate]);

  return null;
};

export default LandingPage;
