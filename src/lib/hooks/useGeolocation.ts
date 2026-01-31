'use client';

import { useState, useEffect, useCallback } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to get GPS location from the device.
 * Requires user permission. Returns null if denied or unavailable.
 */
export function useGeolocation(): GeolocationState & { refresh: () => void } {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    loading: false,
    error: null,
  });

  const fetchLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setState((s) => ({ ...s, loading: false, error: 'Geolocation not supported' }));
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false,
          error: null,
        });
      },
      (err) => {
        setState({
          latitude: null,
          longitude: null,
          loading: false,
          error: err.code === 1 ? 'Permission denied' : err.message,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // Cache for 1 minute
      }
    );
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return { ...state, refresh: fetchLocation };
}
