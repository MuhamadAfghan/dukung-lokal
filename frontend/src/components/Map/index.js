"use client";

import React, { useEffect, useState, useRef, use } from "react";
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./style.css";
import { DUMMY_UMKM_DATA } from "@/lib/DUMMY_DATA";
import "leaflet-routing-machine";
import useGeolocation from "@/hook/useGeoLocation";
import InfoCard from "../ui/info-card";
import ReportUmkmModal from "../ui/report-umkm";
import useGetUmkmAddress from "@/hook/useGetUmkmAddress";
import SurveiUmkmModal from "../ui/survei-umkm";
import axios from "axios";
import Cookies from "js-cookie";
import useTokenStore from "@/hook/useTokenStore";
import useModalLoginStore from "@/store/modalLoginStore";

const createIcon = (iconUrl) =>
  L.icon({
    iconUrl,
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    iconSize: [25, 37],
    shadowSize: [41, 41],
    iconAnchor: [12, 41],
    shadowAnchor: [12, 41],
    popupAnchor: [1, -44],
  });

const PulsatingIcon = L.divIcon({
  className: "pulsatingDot",
  iconSize: [20, 20],
  iconAnchor: [10, 11],
  shadowAnchor: [12, 41],
  popupAnchor: [1, -28],
});

// const DEFAULT_ICON = createIcon(require("leaflet/dist/images/marker-icon.png"));
const DEFAULT_ICON = createIcon("/images/marker_icon/orange_icon.png");
const DEFAULT_ZOOM = 20;
const DEFAULT_LOCATION = { latitude: -6.2088, longitude: 106.8456 };

const UpdateMap = ({ position, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([position.latitude, position.longitude], zoom || DEFAULT_ZOOM);
  }, [position, map, zoom]);
  return null;
};

export default function Map({
  zoom,
  scrollWheelZoom = true,
  classname,
  searchLocation,
}) {
  const [UMKM, setUMKM] = useState([]);
  const [focusedUMKMId, setFocusedUMKMId] = useState(null);
  const [routingControl, setRoutingControl] = useState(null);
  const mapRef = useRef();
  const addresses = useGetUmkmAddress(UMKM);
  const { position } = useGeolocation(DEFAULT_LOCATION);
  const [isModalReportOpen, setIsModalReportOpen] = useState(false);
  const [selectedReportUmkm, setSelectedReportUmkm] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const token = useTokenStore((state) => state.token);

  // useEffect(() => {
  //   if (!token) {
  //     return openLoginModal();
  //   }
  // }, [token]);

  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res.data.data);
          setCurrentUser(res.data.data);
        });
    }
  }, [token]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`)
      .then((res) => {
        console.log(res.data.data);
        setUMKM(res.data.data);
      });
  }, []);

  const addWaypoints = (wayPoint) => {
    if (routingControl) {
      routingControl.setWaypoints(wayPoint);
    } else {
      const control = L.Routing.control({
        waypoints: wayPoint,
        lineOptions: {
          styles: [{ color: "blue", opacity: 0.6, weight: 3 }],
        },
        createMarker: () => null,
        draggableWaypoints: false,
        addWaypoints: false,
        show: false,
      }).addTo(mapRef.current);
      setRoutingControl(control);
    }
  };

  const showOtherLocation = (umkmId) => {
    setFocusedUMKMId(umkmId);

    const selectedUMKM = UMKM.find((umkm) => umkm.id === umkmId);
    if (selectedUMKM && selectedUMKM.positions.length > 0) {
      const newWaypoints = selectedUMKM.positions.map((pos) =>
        L.latLng(pos.latitude, pos.longitude)
      );
      addWaypoints(newWaypoints);
    }
  };

  const closeOtherLocation = () => {
    setFocusedUMKMId(null);
    if (routingControl) {
      routingControl.setWaypoints([]);
      setRoutingControl(null);
    }
  };

  const openReportModal = (reportUmkm) => {
    setSelectedReportUmkm(reportUmkm);
    setIsModalReportOpen(true);
  };

  const closeReportModal = () => {
    
    setIsModalReportOpen(false);
  };

  useEffect(() => {
    !isModalReportOpen
      ? document.body.classList.add("pointer-events-full-auto")
      : document.body.classList.remove("pointer-events-full-auto");
  }, [isModalReportOpen]);

  return (
    <div className={classname}>
      {typeof window !== "undefined" && (
        <MapContainer
          center={[position.latitude, position.longitude]}
          zoom={zoom || DEFAULT_ZOOM}
          scrollWheelZoom={scrollWheelZoom}
          style={{ height: "100%", width: "100%", zIndex: 1 }}
          zoomControl={false}
          whenReady={(map) => {
            map.target.on("click", () => {
              setFocusedUMKMId(null);
            });
            map.target.invalidateSize();
            mapRef.current = map.target;
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            id="mapbox/streets-v12"
            url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGFyLWhlbCIsImEiOiJjbDJnYWRieGMwMTlrM2luenIzMzZwbGJ2In0.RQRMAJqClc4qoNwROT8Umg"
          />

          <ZoomControl position="topright" />

          <Marker
            icon={PulsatingIcon}
            position={[position.latitude, position.longitude]}
          >
            <Popup>Your Location</Popup>
          </Marker>

          {UMKM.map((umkm) =>
            umkm.positions.map((pos) => (
              <Marker
                key={`${umkm.id}-${pos.id}`}
                icon={DEFAULT_ICON}
                position={[pos.latitude, pos.longitude]}
                opacity={
                  focusedUMKMId == null || focusedUMKMId == umkm.id ? 1 : 0.3
                }
                // eventHandlers={{
                //   click: () => {
                //     addWaypoints([
                //       L.latLng(position.latitude, position.longitude),
                //       L.latLng(pos.latitude, pos.longitude),
                //     ]);
                //   },
                // }}
              >
                {routingControl != null &&
                  umkm.positions.some(
                    (position) =>
                      position.latitude ==
                        routingControl.getWaypoints()[0]?.latLng?.lat &&
                      position.longitude ==
                        routingControl.getWaypoints()[0]?.latLng?.lng
                  ) && (
                    <Tooltip permanent direction="top" offset={[0, -35]}>
                      <button
                        onClick={() => closeOtherLocation()}
                        className="text-base cursor-pointer"
                      >
                        ❌
                      </button>
                    </Tooltip>
                  )}

                <Popup className="custom-popup">
                  <InfoCard
                    pos={pos}
                    umkm={umkm}
                    is_reported={
                      currentUser
                        ? currentUser.report_products.includes(umkm.id)
                        : false
                    }
                    position={position}
                    addresses={addresses}
                    myPosition={position}
                    addWaypoints={addWaypoints}
                    openReportModal={openReportModal}
                    closeReportModal={closeReportModal}
                    initLiked={
                      currentUser
                        ? Array.isArray(umkm.likes) &&
                          umkm.likes.includes(currentUser.id)
                        : false
                    }
                    showOtherLocation={showOtherLocation}
                    umkmPosition={[pos.latitude, pos.longitude]}
                  />
                </Popup>
              </Marker>
            ))
          )}
          <UpdateMap position={position} zoom={zoom} />
          {searchLocation && (
            <UpdateMap position={searchLocation} zoom={DEFAULT_ZOOM} />
          )}

          <Circle
            center={[position.latitude, position.longitude]}
            radius={1500}
            pathOptions={{
              color: "#ff812f",
              fillColor: "#ff812f",
              fillOpacity: 0.1,
              weight: 1.5,
            }}
          />
        </MapContainer>
      )}

      <ReportUmkmModal
        isOpen={isModalReportOpen}
        onClose={closeReportModal}
        selectedReportUmkm={selectedReportUmkm}
      />
    </div>
  );
}
