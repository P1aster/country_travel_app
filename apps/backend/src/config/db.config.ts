import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Country } from '@/models/country/entities/country.entity';
import { ExchangeRate } from '@/models/exchange-rate/entities/exchange-rate.entity';
import { Currency } from '@/models/currencies/entities/currency.entity';

const configService = new ConfigService();

export default TypeOrmModule.forRoot({
  type: 'postgres',
  extra: {
    client_encoding: 'UTF8',
  },
  host: configService.get<string>('POSTGRES_HOST'),
  port: parseInt(configService.get<string>('POSTGRES_PORT') || '5432', 10),
  username: configService.get<string>('POSTGRES_USER'),
  password: configService.get<string>('POSTGRES_PASSWORD'),
  database: configService.get<string>('POSTGRES_DB'),
  entities: [Country, ExchangeRate, Currency],
  synchronize: process.env.NODE_ENV !== 'production' ? true : false,
  cache: false,
  retryAttempts: 2,
});
