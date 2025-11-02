import { Module, ValidationPipe } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from '@/config/app.config';
import database from '@/config/db.config';
import { ExchangeRateModule } from '@/models/exchange-rate/exchange-rate.module';
import { CountryModule } from '@/models/country/country.module';
import { CurrenciesModule } from '@/models/currencies/currencies.module';
import { APP_PIPE } from '@nestjs/core';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    config,
    database,
    CountryModule,
    ExchangeRateModule,
    CurrenciesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
