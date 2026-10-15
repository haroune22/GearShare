"use client";

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

type ListingMapProps = {
  address: string;
  latitude: number;
  longitude: number;
};

const listingIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 32px;
      height: 32px;
      background: #d946ef;
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.35);
    ">
      <div style="
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
        position: absolute;
        top: 9px;
        left: 9px;
      "></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export const ListingMap = ({
  address,
  latitude,
  longitude,
}: ListingMapProps) => {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      scrollWheelZoom={false}
      className="h-75 w-full rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[latitude, longitude]} icon={listingIcon}>
        <Popup>{address || "Listing location"}</Popup>
      </Marker>
    </MapContainer>
  );
};
