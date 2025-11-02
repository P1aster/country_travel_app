"use client";
import { countryOptions } from "@/lib/getCoutry";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CoutryStatsItem } from "@/components/coutries/CountryStats";
import CurrencySelector from "@/components/currency/CurrencySelector";
interface CountryPageProps {
  countryId: string;
}

export default function CountryScreen({ countryId }: CountryPageProps) {
  const { data: country } = useSuspenseQuery(countryOptions(countryId));
  return (
    <main className="max-w-7xl mx-auto p-4 space-y-10 md:p-8">
      <div className="flex gap-3 items-center">
        <Button asChild variant="outline">
          <Link href="/">
            <ChevronLeftIcon /> Back
          </Link>
        </Button>
        <h1 className="text-4xl font-bold">
          {country.flag} {country.name}
        </h1>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Basic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <CoutryStatsItem
              label="Capital"
              value={country.capital.join(", ")}
            />

            <CoutryStatsItem
              label="Languages"
              value={country.languages.join(", ")}
            />
            <CoutryStatsItem label="Area" value={`${country.area} km²`} />
            <CoutryStatsItem
              label="Timezones"
              value={country.timezones.join(", ")}
            />
            <CoutryStatsItem
              label="Coordinates"
              value={`${country.latlng.join(", ")}`}
            />
            <CoutryStatsItem
              label="Currency"
              value={`${Object.entries(country.currencies || {})
                .map(
                  ([_code, currency]) =>
                    `${currency.name} ( ${currency.symbol} )`,
                )
                .join(", ")}`}
            />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Currency rates</CardTitle>
          </CardHeader>
          <CardContent>
            <CurrencySelector country={country} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
