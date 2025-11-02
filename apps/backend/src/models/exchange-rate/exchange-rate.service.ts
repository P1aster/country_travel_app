import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { AxiosError } from 'axios';
import { ExchangeRate } from '@/models/exchange-rate/entities/exchange-rate.entity';
import type { EntityManager } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { CurrenciesService } from '@/models/currencies/currencies.service';
import { catchError, firstValueFrom } from 'rxjs';
import type { FrankfurterResponse } from '@/types';

function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

@Injectable()
export class ExchangeRateService {
  private readonly logger = new Logger(ExchangeRateService.name);
  private readonly API_URL = 'https://api.frankfurter.dev/v1/latest';

  constructor(
    @InjectRepository(ExchangeRate)
    private readonly exchangeRateRepository: Repository<ExchangeRate>,
    private readonly currenciesService: CurrenciesService,
    private readonly httpService: HttpService,
  ) {}

  @Cron('30 16 * * *', { timeZone: 'Europe/Paris' })
  async syncExchangeRatesFromApi(): Promise<void> {
    await this.performExchangeRateSync();
  }

  private async performExchangeRateSync(): Promise<void> {
    try {
      this.logger.log('Starting exchange rate sync from Frankfurter API...');
      const currencies = await this.currenciesService.getAllCurrencyCodes();

      if (currencies.length === 0) {
        this.logger.warn('No currencies found in database');
        return;
      }

      const data = await this.fetchExchangeRatesFromApi(currencies);
      await this.saveExchangeRatesToDatabase(data);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      this.logger.error('Error syncing exchange rates from API:', errorMessage);
    }
  }

  private async fetchExchangeRatesFromApi(
    currencies: string[],
  ): Promise<FrankfurterResponse[]> {
    try {
      this.logger.debug('Fetching exchange rates from Frankfurter API...');

      if (currencies.length === 0) {
        this.logger.warn('No valid currencies provided for exchange rate sync');
        return [];
      }

      const responses = await Promise.allSettled(
        currencies.map((currency) =>
          firstValueFrom(
            this.httpService
              .get<FrankfurterResponse>(`${this.API_URL}?base=${currency}`, {
                timeout: 10000,
              })
              .pipe(
                catchError((error: AxiosError) => {
                  throw error;
                }),
              ),
          ).then((response) => response.data),
        ),
      );

      return responses
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      this.logger.error(
        'Failed to fetch exchange rates from API:',
        errorMessage,
      );
      throw error;
    }
  }

  private async saveExchangeRatesToDatabase(
    data: FrankfurterResponse[],
    manager?: EntityManager,
  ): Promise<void> {
    const repo = manager
      ? manager.getRepository(ExchangeRate)
      : this.exchangeRateRepository;

    for (const response of data) {
      try {
        const date = new Date(response.date);

        const baseCurrency = await this.currenciesService.findOne(
          response.base,
          manager,
        );

        if (!baseCurrency) {
          this.logger.warn(`Base currency ${response.base} not found`);
          continue;
        }

        for (const [currencyCode, rate] of Object.entries(response.rates)) {
          try {
            const existingRate = await repo.findOne({
              where: {
                base: response.base,
                currencyCode,
                date,
              },
            });

            if (!existingRate) {
              const exchangeRate = repo.create({
                base: response.base,
                currencyCode,
                rate,
                date,
                baseCurrency: { code: response.base },
              });

              await repo.save(exchangeRate);
            }
          } catch (error) {
            this.logger.warn(
              `Failed to save exchange rate ${response.base}/${currencyCode}:`,
              getErrorMessage(error),
            );
          }
        }
      } catch (error) {
        this.logger.warn(
          `Failed to process exchange rate response for ${response.base}:`,
          getErrorMessage(error),
        );
      }
    }
  }

  async updateExchangeRates(
    currencies: string[],
    manager?: EntityManager,
  ): Promise<void> {
    try {
      const fetchedRates = await this.fetchExchangeRatesFromApi(currencies);
      await this.saveExchangeRatesToDatabase(fetchedRates, manager);
      this.logger.log(
        `Updated exchange rates for ${currencies.length} currencies`,
      );
    } catch (error) {
      this.logger.error(
        'Failed to update exchange rates:',
        getErrorMessage(error),
      );
      throw error;
    }
  }

  async getRatesByBaseCurrency(
    baseCurrencyCode: string,
  ): Promise<ExchangeRate[]> {
    const maxDate = await this.exchangeRateRepository
      .createQueryBuilder('er')
      .select('MAX(er.date)', 'maxDate')
      .where('er.base = :base', { base: baseCurrencyCode })
      .getRawOne<{ maxDate: Date }>();

    if (!maxDate?.maxDate) {
      return [];
    }

    return this.exchangeRateRepository.find({
      where: {
        base: baseCurrencyCode,
        date: maxDate.maxDate,
      },
      relations: ['baseCurrency', 'targetCurrency'],
    });
  }

  async getRatesHistory(
    baseCurrencyCode: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<ExchangeRate[]> {
    return this.exchangeRateRepository.find({
      where: {
        base: baseCurrencyCode,
        date: Between(fromDate, toDate),
      },
      relations: ['baseCurrency', 'targetCurrency'],
      order: { date: 'DESC' },
    });
  }
}
