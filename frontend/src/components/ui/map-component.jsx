"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function MapComponent({ position, marker, onMarkerAdd }) {
  return (
    <MapContainer
      center={[position.latitude, position.longitude]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      onClick={onMarkerAdd}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Marker position={marker ?? [position.latitude, position.longitude]}>
        <Popup>Selected location</Popup>
      </Marker>
    </MapContainer>
  );
}