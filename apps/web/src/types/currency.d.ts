import type { ExchangeRateBasic } from ".";
export interface Currency {
  name: string;
  symbol: string;
  exchangeRates: ExchangeRateBasic[];
}
