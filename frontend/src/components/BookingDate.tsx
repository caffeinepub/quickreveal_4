import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const BookingDate: React.FC = () => {
  const { navigate } = useAppContext();

  // This component is superseded by BookingFlow
  useEffect(() => {
    navigate('explorer');
  }, [navigate]);

  return null;
};

export default BookingDate;
