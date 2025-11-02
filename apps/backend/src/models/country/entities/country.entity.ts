import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  PrimaryColumn,
} from 'typeorm';
import { Currency } from '@/models/currencies/entities/currency.entity';

@Entity('countries')
export class Country {
  @PrimaryColumn({ type: 'varchar', length: 3 })
  id: string;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'varchar', array: true, nullable: false })
  capital: string[];

  @Column({ type: 'varchar', length: 50, nullable: false })
  flag: string;

  @Column({ type: 'float', nullable: false })
  area: number;

  @Column({ type: 'varchar', array: true, nullable: false, default: [] })
  languages: string[];

  @Column({ type: 'jsonb', nullable: false })
  maps: { googleMaps: string; openStreetMaps: string };

  @Column({ type: 'varchar', array: true, nullable: false })
  timezones: string[];

  @Column({ type: 'float', array: true, nullable: false })
  latlng: number[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Currency, (currency) => currency.countries)
  @JoinTable()
  currencies: Currency[];
}
