import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Role } from '../enums/role.enum';

@Entity('user_roles')
@Unique('UQ_USER_ROLE', ['userId', 'role'])
export class UserRole {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @ManyToOne(
        () => User,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn({
        name: 'userId',
    })
    user: User;

    @Column({
        type: 'text',
    })
    role: Role;

    @CreateDateColumn()
    created_at: Date;
}