"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Country } from "@/types";
import L from "leaflet";

interface MapProps {
  countries?: Country[];
  style?: React.CSSProperties;
};

export function Map({ countries, style }: MapProps) {

  return (
    <MapContainer
      center={[20, 0]}
      zoom={3}
      style={{ height: "100vh", width: "100%", zIndex: 1, ...style }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {countries?.map((country) => (
        <Marker
          key={country.id}
          position={[country.latlng[0]!, country.latlng[1]!]}
          icon={new L.Icon({
            iconUrl: 'map-pin.png',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          })}
        >
          <Popup>
            <h3>
              {country.flag} {country.name}
            </h3>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
