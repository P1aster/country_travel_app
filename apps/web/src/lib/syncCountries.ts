import { mutationOptions } from "@tanstack/react-query";
import { CountryService } from "@/services/country.service";

export const syncCountriesOptions = mutationOptions({
  mutationFn: async () => {
    return await CountryService.triggerManualSync();
  },
});
