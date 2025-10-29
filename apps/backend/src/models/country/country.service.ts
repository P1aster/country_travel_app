import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios, { AxiosError } from 'axios';
import { Country } from '@/models/country/entities/country.entity';

interface CountryApiResponse {
  name: {
    common: string;
    official: string;
  };
  capital?: string[];
  flag?: string;
  latlng?: number[];
  currencies?: Record<string, any>;
  [key: string]: any;
}

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
    'https://restcountries.com/v3.1/all?status=true&fields=name,capital,flag,latlng,currencies';

  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      this.logger.log('Initializing country data on app startup...');
      const countryCount = await this.countryRepository.count();

      if (countryCount === 0) {
        this.logger.log('Database is empty. Fetching countries from API...');
        await this.syncCountriesFromApi();
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

  @Cron(CronExpression.EVERY_10_SECONDS)
  async syncCountriesFromApi(): Promise<void> {
    try {
      this.logger.log('Starting daily country data sync...');
      const countries = await this.fetchCountriesFromApi();
      await this.saveCountriesToDatabase(countries);
      this.logger.log(
        `Successfully synced ${countries.length} countries to database`,
      );
    } catch (error) {
      console.log('Sync failed');
      const errorMessage = getErrorMessage(error);
      this.logger.error('Error syncing countries from API:', errorMessage);
    }
  }

  private async fetchCountriesFromApi(): Promise<CountryApiResponse[]> {
    try {
      this.logger.debug('Fetching countries from API...');
      const response = await axios.get<CountryApiResponse[]>(this.API_URL, {
        timeout: 10000,
      });
      this.logger.debug(`Received ${response.data.length} countries from API`);
      return response.data;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      this.logger.error('Failed to fetch countries from API:', errorMessage);
      throw error;
    }
  }


  private async saveCountriesToDatabase(
    countries: CountryApiResponse[],
  ): Promise<void> {
    for (const countryData of countries) {
      try {
        let countryName: string;
        if (typeof countryData.name === 'string') {
          countryName = countryData.name;
        } else if (
          countryData.name &&
          typeof countryData.name === 'object' &&
          'common' in countryData.name
        ) {
          countryName = countryData.name.common;
        } else {
          this.logger.warn('Country has no valid name, skipping');
          continue;
        }

        const existingCountry = await this.countryRepository.findOne({
          where: { name: countryName },
        });

        const countryEntity: Partial<Country> = {
          name: countryName,
          capital: countryData.capital?.[0] || undefined,
          flag: countryData.flag || undefined,
          latlng: countryData.latlng || undefined,
          currencies: countryData.currencies || undefined,
          rawData: countryData,
        };

        if (existingCountry) {
          await this.countryRepository.update(
            existingCountry.id,
            countryEntity,
          );
        } else {
          await this.countryRepository.save(countryEntity);
        }
      } catch (error) {
        let countryIdentifier = 'unknown';
        if (typeof countryData.name === 'string') {
          countryIdentifier = countryData.name;
        } else if (
          countryData.name &&
          typeof countryData.name === 'object' &&
          'common' in countryData.name
        ) {
          countryIdentifier = (countryData.name as { common: string }).common;
        }
        const errorMessage = getErrorMessage(error);
        this.logger.warn(
          `Failed to save country ${countryIdentifier}: ${errorMessage}`,
        );
      }
    }
  }


  async findAll(): Promise<Country[]> {
    return this.countryRepository.find();
  }


  async findOne(id: string): Promise<Country | null> {
    return this.countryRepository.findOne({
      where: { id },
    });
  }


  async manualSync(): Promise<{ message: string; count: number }> {
    try {
      const countries = await this.fetchCountriesFromApi();
      await this.saveCountriesToDatabase(countries);
      return {
        message: 'Countries synced successfully',
        count: countries.length,
      };
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      this.logger.error('Manual sync failed:', errorMessage);
      throw error;
    }
  }
}
