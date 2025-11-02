import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { Country } from './entities/country.entity';
import { ExchangeRateModule } from '@/models/exchange-rate/exchange-rate.module';
import { CurrenciesModule } from '@/models/currencies/currencies.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country]),
    ExchangeRateModule,
    CurrenciesModule,
    HttpModule,
  ],
  controllers: [CountryController],
  providers: [CountryService],
  exports: [CountryService],
})
export class CountryModule {}
