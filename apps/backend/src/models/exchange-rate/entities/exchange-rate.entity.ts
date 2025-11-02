import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Currency } from '@/models/currencies/entities/currency.entity';

@Entity('exchange-rates')
@Index(['base', 'currencyCode', 'date'], { unique: true })
export class ExchangeRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 3 })
  base: string;

  @Column({ type: 'varchar', length: 3 })
  currencyCode: string;

  @Column({ type: 'numeric', precision: 14, scale: 4 })
  rate: number;

  @Column({ type: 'date' })
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'baseCurrencyCode' })
  baseCurrency: Currency;

  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'targetCurrencyCode' })
  targetCurrency: Currency;
}
