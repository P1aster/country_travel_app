"use client";

import CoutriesListCommand from "@/components/coutries/CoutriesListCommand";
import { Map } from "@/components/map/Map";
import { allCountriesOptions } from "@/lib/getAllCountries";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function HomePage() {
  const { data: countries } = useSuspenseQuery(allCountriesOptions);

  return (
    <div>
      <div className="flex justify-center h-[15vh] p-6">
        <CoutriesListCommand />
      </div>
      <Map countries={countries} style={{ height: "85vh" }} />
    </div>
  );
}
