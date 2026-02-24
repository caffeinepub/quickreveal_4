import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const BookingContact: React.FC = () => {
  const { navigate } = useAppContext();

  // This component is superseded by BookingFlow
  useEffect(() => {
    navigate('explorer');
  }, [navigate]);

  return null;
};

export default BookingContact;
