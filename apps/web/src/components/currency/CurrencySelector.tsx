"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CountryDetailed } from "@/types";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CurrencySelectorProps {
  country: CountryDetailed;
}

export default function CurrencySelector({ country }: CurrencySelectorProps) {
  const currencyEntries = Object.entries(country.currencies);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    currencyEntries[0]?.[0] || "",
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  const selectedCurrencyData = selectedCurrency
    ? country.currencies[selectedCurrency]
    : null;

  const filteredExchangeRates = selectedCurrencyData?.exchangeRates.filter(
    (rate) =>
      rate.currencyCode.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <label htmlFor="currency-select" className="text-sm font-medium">
          Currency
        </label>
        <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
          <SelectTrigger id="currency-select">
            <SelectValue placeholder="Select a currency" />
          </SelectTrigger>
          <SelectContent>
            {currencyEntries.map(([code, currency]) => (
              <SelectItem key={code} value={code}>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{code}</span>
                  <span className="text-muted-foreground">
                    {currency.symbol}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    - {currency.name}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCurrencyData && (
        <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Exchange Rates</h3>
            <Badge variant="secondary">
              {selectedCurrency} {selectedCurrencyData.symbol}
            </Badge>
          </div>

          {selectedCurrencyData.exchangeRates.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search currency code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          )}

          {filteredExchangeRates && filteredExchangeRates.length > 0 ? (
            <div className="space-y-2">
              {filteredExchangeRates.map((rate, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-md bg-background p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-medium">
                      {rate.currencyCode}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{rate.rate.toFixed(4)}</div>
                    <div className="text-xs text-muted-foreground">
                      1 {selectedCurrency} = {rate.rate} {rate.currencyCode}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : selectedCurrencyData.exchangeRates.length > 0 ? (
            <p className="text-sm text-muted-foreground">
              No matching currency codes found
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              No exchange rates available
            </p>
          )}
        </div>
      )}
    </div>
  );
}
