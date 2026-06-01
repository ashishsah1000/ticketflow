import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('float', { nullable: true })
  price: number;

  @Column({ nullable: true })
  priceOriginal: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true })
  store: string;

  @Column({ nullable: true })
  category: string;

  @Column('float', { nullable: true })
  ratings: number;

  @Column({ name: 'complainCount', nullable: true })
  complainCount: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true })
  date: string;

  @Column({ nullable: true })
  companyId: number;

  @ManyToOne(() => Company, (company) => company.products, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'companyId' })
  company: Company;
}
