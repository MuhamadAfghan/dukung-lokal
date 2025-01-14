import { useMemo } from "react";
import L from "leaflet";

const useCalculateDistance = (lat1, lon1, lat2, lon2) => {
  return useMemo(() => {
    if (lat1 && lon1 && lat2 && lon2) {
      return L.latLng(lat1, lon1).distanceTo(L.latLng(lat2, lon2));
    }
    return null;
  }, [lat1, lon1, lat2, lon2]);
};

export default useCalculateDistance;
