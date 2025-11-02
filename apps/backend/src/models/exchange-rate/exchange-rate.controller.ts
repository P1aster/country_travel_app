import { Controller, Get, Query, Param, ParseDatePipe } from '@nestjs/common';

import { ExchangeRateService } from '@/models/exchange-rate/exchange-rate.service';

@Controller('exchange-rates')
export class ExchangeRateController {
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  @Get(':currencyCode/history')
  async getRatesHistory(
    @Param('currencyCode') currencyCode: string,
    @Query('fromDate', new ParseDatePipe()) fromDate: Date,
    @Query('toDate', new ParseDatePipe()) toDate: Date,
  ) {
    return await this.exchangeRateService.getRatesHistory(
      currencyCode,
      fromDate,
      toDate,
    );
  }
}
