import { useState, useEffect } from "react";

interface GeolocationState {
  location: {
    latitude: number;
    longitude: number;
  } | null;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: "Geolocation is not supported",
      }));
      return;
    }

    const success = (position: GeolocationPosition) => {
      setState({
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        error: null,
      });
    };

    const error = (error: GeolocationPositionError) => {
      setState(prev => ({
        ...prev,
        error: error.message,
      }));
    };

    const watcher = navigator.geolocation.watchPosition(success, error, {
      enableHighAccuracy: true,
    });

    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  return state;
}
