import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

import { UserStatus } from '../enums/user-status.enum';
import { UserRole } from 'src/roles/entities/user-role.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  firstname: string;

  @Column({
    nullable: false,
  })
  lastname: string;

  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    unique: true,
    nullable: false,
  })
  phone: string;

  @Column({
    nullable: false,
    select: false,
  })
  password: string;

  @CreateDateColumn({
    type: 'datetime',
  })
  created_at: Date;

  @Column({
    default: false,
  })
  admin: boolean;

  @Column({
    type: 'text',
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @OneToMany(
    () => UserRole,
    (role) => role.user,
  )
  roles: UserRole[];
}