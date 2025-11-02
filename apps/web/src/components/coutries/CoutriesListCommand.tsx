"use client";

import { useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import type { CountryBasic } from "@/types";

interface CoutriesListCommandProps {
  onCountrySelect: (countryId: string) => void;
  countries?: CountryBasic[];
}

export default function CoutriesListCommand({
  countries,
  onCountrySelect,
}: CoutriesListCommandProps) {
  const [open, setOpen] = useState<boolean>(false);

  const handleCountrySelect = (countryId: string) => {
    setOpen(false);
    onCountrySelect(countryId);
  };

  return (
    <>
      <Button onClick={() => setOpen((open) => !open)}>
        Search for places
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen} className="z-50">
        <CommandInput placeholder="Type a place or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Places">
            {countries?.map((country) => (
              <CommandItem
                key={country.id}
                onSelect={() => handleCountrySelect(country.id)}
              >
                {country.flag} {country.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
