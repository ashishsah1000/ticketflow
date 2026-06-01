import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Issue } from './issue.entity';

@Entity('issue_activity')
export class IssueActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Issue, issue => issue.activities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'issue_id' })
  issue: Issue;

  @Column({ type: 'uuid' })
  issue_id: string;

  // 'call', 'mail', 'status_change', 'action_change', 'escalation_change'
  @Column()
  activity_type: string;

  @Column({ type: 'text' })
  details: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
}
