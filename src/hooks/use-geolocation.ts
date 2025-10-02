
"use client";

import { useState, useEffect, useCallback } from 'react';

interface GeolocationPosition {
  latitude: number;
  longitude: number;
}

interface UseGeolocationState {
  loading: boolean;
  position: GeolocationPosition | null;
  error: GeolocationPositionError | Error | null;
}

export function useGeolocation() {
  const [state, setState] = useState<UseGeolocationState>({
    loading: false,
    position: null,
    error: null,
  });

  const getPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prevState => ({
        ...prevState,
        error: new Error("Geolocation is not supported by your browser."),
        loading: false,
      }));
      return;
    }

    setState(prevState => ({ ...prevState, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          loading: false,
          position: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
          error: null,
        });
      },
      (err) => {
        setState({
          loading: false,
          position: null,
          error: err,
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  return { ...state, getPosition };
}
