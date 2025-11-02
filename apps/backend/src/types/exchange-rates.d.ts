export interface ExchangeRateBasic {
  currencyCode: string;
  rate: number;
  date: Date;
}

export interface FrankfurterResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}
