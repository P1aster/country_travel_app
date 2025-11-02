import { Currency } from '.';

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

export interface CountryApiResponse {
  cca3: string;
  name: {
    common: string;
    official: string;
  };
  maps: {
    googleMaps: string;
    openStreetMaps: string;
  };
  capital: string[];
  flag: string;
  latlng: number[];
  timezones: string[];
  area: number;
  languages: Record<string, string>;
  currencies: Record<string, { name: string; symbol: string }>;
}
