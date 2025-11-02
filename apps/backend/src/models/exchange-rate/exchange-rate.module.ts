import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRate } from '@/models/exchange-rate/entities/exchange-rate.entity';
import { Country } from '@/models/country/entities/country.entity';
import { Currency } from '@/models/currencies/entities/currency.entity';
import { ExchangeRateService } from '@/models/exchange-rate/exchange-rate.service';
import { ExchangeRateController } from '@/models/exchange-rate/exchange-rate.controller';
import { HttpModule } from '@nestjs/axios';
import { CurrenciesModule } from '@/models/currencies/currencies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExchangeRate, Country, Currency]),
    HttpModule,
    CurrenciesModule,
  ],
  controllers: [ExchangeRateController],
  providers: [ExchangeRateService],
  exports: [ExchangeRateService],
})
export class ExchangeRateModule {}
