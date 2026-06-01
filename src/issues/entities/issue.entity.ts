import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { IssueActivity } from './issue-activity.entity';
import { OneToMany } from 'typeorm';

@Entity('issue')
export class Issue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 6, nullable: true })
  tokenId: string;

  @OneToMany(() => IssueActivity, activity => activity.issue)
  activities: IssueActivity[];

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ nullable: true })
  product_id: number;

  @Column()
  name: string;

  @Column()
  mobile_number: string;

  @Column({ type: 'date' })
  date_of_purchase: Date;

  @Column({ nullable: true })
  device: string;

  @Column({ type: 'text' })
  issue_with_device: string;

  @Column({ type: 'date' })
  date_of_issue: Date;

  @Column({ type: 'date' })
  date_for_pickup: Date;

  @Column()
  timeslot_for_pickup: string;

  @Column({ type: 'int', default: 1 })
  escalation: number;

  @Column({ default: 'raised' })
  status: string;

  @Column({ nullable: true })
  action: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
}
