import { queryOptions } from "@tanstack/react-query";
import { CountryService } from "@/services/country.service";

export const allCountriesOptions = queryOptions({
  queryKey: ["countries"],
  queryFn: async () => {
    return await CountryService.getAllCountries();
  },
});
