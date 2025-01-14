import { useState, useEffect, useCallback, useRef } from "react";

const useGeolocation = (
  defaultLocation = { latitude: -6.2088, longitude: 106.8456 }
) => {
  const [position, setPosition] = useState(defaultLocation);
  const previousPosition = useRef(defaultLocation);

  const handleGeolocationSuccess = useCallback((position) => {
    const { latitude, longitude } = position.coords;
    const newPosition = { latitude, longitude };

    if (
      newPosition.latitude != previousPosition.current.latitude ||
      newPosition.longitude != previousPosition.current.longitude
    ) {
      setPosition(newPosition);
      previousPosition.current = newPosition;
    }
  }, []);

  const handleGeolocationError = useCallback(() => {
    console.log("Geolocation error.");
    setPosition(defaultLocation);
  }, [defaultLocation]);

  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        handleGeolocationSuccess,
        handleGeolocationError,
        {
          enableHighAccuracy: true,
        }
      );
    }
  }, [handleGeolocationSuccess, handleGeolocationError]);

  return { position, setPosition };
};

export default useGeolocation;
