import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from './entities/currency.entity';
import type { EntityManager } from 'typeorm';

@Injectable()
export class CurrenciesService {
  private readonly logger = new Logger(CurrenciesService.name);

  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

  async syncCurrencies(
    currencyRecords: Record<string, { name: string; symbol: string }>,
    manager?: EntityManager,
  ): Promise<Currency[]> {
    const repo = manager
      ? manager.getRepository(Currency)
      : this.currencyRepository;

    const currencies: Currency[] = [];

    for (const [code, { name, symbol }] of Object.entries(currencyRecords)) {
      try {
        let currency = await repo.findOne({
          where: { code },
        });

        if (!currency) {
          currency = repo.create({
            code,
            name,
            symbol,
          });
          currency = await repo.save(currency);
          this.logger.debug(`Created currency: ${code}`);
        } else {
          if (currency.name !== name || currency.symbol !== symbol) {
            await repo.update(code, { name, symbol });
            currency.name = name;
            currency.symbol = symbol;
            this.logger.debug(`Updated currency: ${code}`);
          }
        }

        currencies.push(currency);
      } catch (error) {
        this.logger.warn(
          `Failed to sync currency ${code}:`,
          error instanceof Error ? error.message : String(error),
        );
      }
    }

    return currencies;
  }

  async getAllCurrencyCodes(manager?: EntityManager): Promise<string[]> {
    const repo = manager
      ? manager.getRepository(Currency)
      : this.currencyRepository;

    const currencies = await repo.find();
    return currencies.map((c) => c.code);
  }

  async findAll(manager?: EntityManager): Promise<Currency[]> {
    const repo = manager
      ? manager.getRepository(Currency)
      : this.currencyRepository;

    return repo.find();
  }

  async findOne(
    code: string,
    manager?: EntityManager,
  ): Promise<Currency | null> {
    return manager
      ? manager.findOne(Currency, { where: { code } })
      : this.currencyRepository.findOne({ where: { code } });
  }
}
