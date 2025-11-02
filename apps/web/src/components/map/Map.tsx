"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { CountryBasic } from "@/types";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CoutryStatsItem } from "@/components/coutries/CountryStats";

interface MapProps {
  countries?: CountryBasic[];
  selectedCountryId?: string | null;
  style?: React.CSSProperties;
}

interface MarkerWithId extends L.Marker {
  _countryId?: string;
}

function MapController({
  selectedCountryId,
  countries,
}: {
  selectedCountryId?: string | null;
  countries?: CountryBasic[];
}) {
  const map = useMap();
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  useEffect(() => {
    markersRef.current = {};
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        const marker = layer as MarkerWithId;
        const countryId = marker._countryId;
        if (countryId) {
          markersRef.current[countryId] = layer;
        }
      }
    });
  }, [map, countries]);

  useEffect(() => {
    if (selectedCountryId && countries) {
      const country = countries.find((c) => c.id === selectedCountryId);
      if (country) {
        map.flyTo([country.latlng[0]!, country.latlng[1]!], 6, {
          duration: 1.5,
        });

        setTimeout(() => {
          const marker = markersRef.current[selectedCountryId];
          if (marker) {
            marker.openPopup();
          }
        }, 1500);
      }
    }
  }, [selectedCountryId, map, countries]);

  return null;
}

export function Map({ countries, selectedCountryId, style }: MapProps) {
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

      <MapController
        selectedCountryId={selectedCountryId}
        countries={countries}
      />

      {countries?.map((country) => (
        <Marker
          key={country.id}
          position={[country.latlng[0]!, country.latlng[1]!]}
          icon={
            new L.DivIcon({
              className: "p-0 bg-transparent w-fit cursor-pointer",
              html: `<div class="p-1 bg-background border rounded-sm shadow-md hover:shadow-lg transition-shadow">${country.flag}-${country.id}</div>`,
              iconSize: [54, 32],
              iconAnchor: [24, 0],
            })
          }
          ref={(ref) => {
            if (ref) {
              (ref as MarkerWithId)._countryId = country.id;
            }
          }}
        >
          <Popup>
            <h3 className="text-primary text-lg my-2 font-medium">
              {country.flag} {country.name}
            </h3>
            <div className="text-xs">
              <CoutryStatsItem
                label="Capital"
                value={country.capital.join(", ")}
              />
              <CoutryStatsItem label="Area" value={String(country.area)} />
              <CoutryStatsItem
                label="Coordinates"
                value={`${country.latlng.join(", ")}`}
              />
            </div>
            <div className="w-full flex justify-center">
              <Button asChild variant={"secondary"}>
                <Link href={`/country/${country.id}`}>View Details</Link>
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
