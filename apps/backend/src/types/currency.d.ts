import type { ExchangeRateBasic } from '@/types';

export interface Currency {
  name: string;
  symbol: string;
  exchangeRates: ExchangeRateBasic[];
}
