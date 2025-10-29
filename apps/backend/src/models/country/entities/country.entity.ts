import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  capital: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  flag: string;

  @Column({ type: 'float', array: true, nullable: true })
  latlng: number[];

  @Column({ type: 'jsonb', nullable: true })
  currencies: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  rawData: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
