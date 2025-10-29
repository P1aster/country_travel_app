export interface Country {
  id: string;
  name: string;
  capital: string;
  flag: string;
  latlng: number[];
  currencies?: Record<string, any>;
  rawData?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CountrySyncResponse {
  message: string;
  count: number;
}
