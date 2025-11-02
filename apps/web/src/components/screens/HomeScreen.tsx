"use client";

import { useState } from "react";
import CoutriesListCommand from "@/components/coutries/CoutriesListCommand";
import { Map } from "@/components/map/Map";
import { allCountriesOptions } from "@/lib/getAllCountries";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function HomeScreen() {
  const { data: countries } = useSuspenseQuery(allCountriesOptions);
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(
    null,
  );

  return (
    <div className="relative">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-fit p-6 bg-card rounded-xl border shadow-lg z-20">
        <CoutriesListCommand
          countries={countries}
          onCountrySelect={setSelectedCountryId}
        />
      </div>
      <Map countries={countries} selectedCountryId={selectedCountryId} />
    </div>
  );
}
