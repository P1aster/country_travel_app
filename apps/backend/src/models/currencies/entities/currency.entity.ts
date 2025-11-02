import { Entity, Column, PrimaryColumn, ManyToMany } from 'typeorm';
import { Country } from '@/models/country/entities/country.entity';

@Entity('currencies')
export class Currency {
  @PrimaryColumn({ type: 'varchar', length: 3 })
  code: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  symbol: string;

  @ManyToMany(() => Country, (country) => country.currencies)
  countries: Country[];
}
