import { queryOptions } from "@tanstack/react-query";
import { CountryService } from "@/services/country.service";

export const countryOptions = (id: string) => queryOptions({
  queryKey: ["countries", id],
  queryFn: async () => {
    return await CountryService.getCountryById(id);
  },
});
