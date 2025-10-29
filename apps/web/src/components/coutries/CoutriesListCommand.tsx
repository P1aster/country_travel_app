"use client";

import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { allCountriesOptions } from "@/lib/getAllCountries";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { syncCountriesOptions } from "@/lib/syncCountries";
export default function CoutriesListCommand() {
  const [open, setOpen] = useState<boolean>(false);

  const { data } = useSuspenseQuery(allCountriesOptions);
  const {mutate} = useMutation(syncCountriesOptions)

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <Button onClick={() => { setOpen((open) => !open);  mutate()}}>
        Search for countries
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen} className="z-50">
        <CommandInput placeholder="Type a country or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Countries">
            {data?.map((country) => (
              <CommandItem key={country.id}>
                {country.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
