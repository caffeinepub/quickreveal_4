import { useState, useCallback } from 'react';

interface Coordinates {
  lat: number;
  lon: number;
}

interface GeolocationState {
  coordinates: Coordinates | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    loading: false,
    error: null,
  });

  const requestPermission = useCallback(() => {
    if (!navigator.geolocation) {
      setState(s => ({ ...s, error: 'Géolocalisation non supportée' }));
      return;
    }

    setState(s => ({ ...s, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      position => {
        const coords: Coordinates = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        sessionStorage.setItem('nexus_user_coords', JSON.stringify(coords));
        setState({ coordinates: coords, loading: false, error: null });
      },
      error => {
        let message = 'Localisation refusée';
        if (error.code === error.PERMISSION_DENIED) {
          message = 'Permission refusée. Entrez votre ville manuellement.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = 'Position indisponible.';
        }
        setState({ coordinates: null, loading: false, error: message });
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  return { ...state, requestPermission };
}
