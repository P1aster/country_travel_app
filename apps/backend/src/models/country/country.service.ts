import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AxiosError } from 'axios';
import { Country } from '@/models/country/entities/country.entity';
import type {
  CountryBasic,
  CountryDetailed,
  CountryApiResponse,
} from '@/types';
import { NotFoundException } from '@nestjs/common';
import { ExchangeRateService } from '@/models/exchange-rate/exchange-rate.service';
import { CurrenciesService } from '@/models/currencies/currencies.service';
import { HttpService } from '@nestjs/axios';
import { Currency } from '@/models/currencies/entities/currency.entity';
import { catchError, firstValueFrom } from 'rxjs';

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
export class CountryService implements OnModuleInit {
  private readonly logger = new Logger(CountryService.name);
  private readonly API_URL =
    'https://restcountries.com/v3.1/all?status=true&fields=name,capital,flag,area,latlng,maps,timezones,currencies,languages,cca3';

  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    private readonly exchangeRateService: ExchangeRateService,
    private readonly currenciesService: CurrenciesService,
    private readonly httpService: HttpService,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      this.logger.log('Initializing country data on app startup...');
      const countryCount = await this.countryRepository.count();

      if (countryCount === 0) {
        this.logger.log('Database is empty. Fetching countries from API...');
        await this.performCountrySync();
      } else {
        this.logger.log(
          `Database already contains ${countryCount} countries. Skipping initial fetch.`,
        );
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      this.logger.error(
        'Error during country data initialization:',
        errorMessage,
      );
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncCountriesFromApi(): Promise<void> {
    await this.performCountrySync();
  }

  private async performCountrySync(): Promise<void> {
    const queryRunner =
      this.countryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      this.logger.log('Starting country data sync...');
      const countries = await this.fetchCountriesFromApi();

      const allCurrencies = countries.reduce(
        (acc, country) => ({ ...acc, ...country.currencies }),
        {},
      );

      const syncedCurrencies = await this.currenciesService.syncCurrencies(
        allCurrencies,
        queryRunner.manager,
      );

      await this.saveCountriesToDatabase(
        countries,
        syncedCurrencies,
        queryRunner.manager,
      );

      const currencyCodes = syncedCurrencies.map((c) => c.code);
      await this.exchangeRateService.updateExchangeRates(
        currencyCodes,
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();

      this.logger.log(
        `Successfully synced ${countries.length} countries and ${syncedCurrencies.length} currencies`,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      const errorMessage = getErrorMessage(error);
      this.logger.error('Error syncing countries from API:', errorMessage);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async fetchCountriesFromApi(): Promise<CountryApiResponse[]> {
    try {
      this.logger.debug('Fetching countries from API...');
      const { data } = await firstValueFrom(
        this.httpService.get<CountryApiResponse[]>(this.API_URL).pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
      );
      return data;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      this.logger.error('Failed to fetch countries from API:', errorMessage);
      throw error;
    }
  }

  private async saveCountriesToDatabase(
    countries: CountryApiResponse[],
    currencyEntities: Currency[],
    manager?: EntityManager,
  ): Promise<void> {
    const repo = manager
      ? manager.getRepository(Country)
      : this.countryRepository;

    for (const countryData of countries) {
      try {
        const countryName = countryData.name.common;
        const existingCountry = await repo.findOne({
          where: { name: countryName },
          relations: ['currencies'],
        });

        const countryCurrencies = currencyEntities.filter(
          (c) => countryData.currencies && countryData.currencies[c.code],
        );

        const countryEntity: Partial<Country> = {
          id: countryData.cca3,
          name: countryName,
          capital: countryData.capital,
          flag: countryData.flag,
          area: countryData.area,
          maps: countryData.maps,
          latlng: countryData.latlng,
          languages: countryData.languages
            ? Object.values(countryData.languages)
            : [],
          timezones: countryData.timezones,
        };

        if (existingCountry) {
          await repo.update(existingCountry.id, countryEntity);
          await repo
            .createQueryBuilder()
            .relation(Country, 'currencies')
            .of(existingCountry.id)
            .addAndRemove(countryCurrencies, existingCountry.currencies);
        } else {
          const newCountry = repo.create(countryEntity);
          newCountry.currencies = countryCurrencies;
          await repo.save(newCountry);
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        this.logger.warn(
          `Failed to save country ${countryData.name.common}: ${errorMessage}`,
        );
      }
    }
  }

  async findAll(): Promise<Partial<CountryBasic>[]> {
    return this.countryRepository.find({
      select: ['id', 'name', 'capital', 'flag', 'area', 'latlng'],
    });
  }

  async findOne(id: string): Promise<CountryDetailed> {
    const country = await this.countryRepository.findOne({
      where: { id },
      relations: ['currencies'],
      select: [
        'id',
        'name',
        'capital',
        'flag',
        'area',
        'latlng',
        'languages',
        'timezones',
      ],
    });

    if (!country) {
      throw new NotFoundException({
        error: 'Country not found',
        message: `Country with id "${id}" not found`,
      });
    }

    const enrichedCurrencies: Record<string, any> = {};

    for (const currency of country.currencies) {
      const rates = await this.exchangeRateService.getRatesByBaseCurrency(
        currency.code,
      );

      enrichedCurrencies[currency.code] = {
        name: currency.name,
        symbol: currency.symbol,
        exchangeRates: rates.map((rate) => ({
          currencyCode: rate.currencyCode,
          rate: parseFloat(rate.rate.toString()),
          date: rate.date,
        })),
      };
    }

    return {
      ...country,
      currencies: enrichedCurrencies,
    };
  }
}
