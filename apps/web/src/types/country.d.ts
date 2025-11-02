import { Currency } from "./currency";

export interface CountryBasic {
  id: string;
  name: string;
  capital: string[];
  flag: string;
  area: number;
  latlng: number[];
}

export interface CountryDetailed extends CountryBasic {
  languages: string[];
  timezones: string[];
  currencies: Record<string, Currency>;
  maps: { googleMaps: string; openStreetMaps: string };
}

export interface CountrySyncResponse {
  success: boolean;
  message: string;
  syncedCount?: number;
  timestamp: Date;
}
