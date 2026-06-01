import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../roles/entities/user-role.entity';
import { Role } from '../roles/enums/role.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  async findAllUsers() {
    return this.userRepository.find({
      relations: ['roles'],
      order: { created_at: 'DESC' },
    });
  }

  async updateUserRoles(userId: string, newRoles: Role[]) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Delete existing roles
    await this.userRoleRepository.delete({ userId });

    // Insert new roles
    if (newRoles && newRoles.length > 0) {
      const rolesToInsert = newRoles.map((role) => {
        return this.userRoleRepository.create({
          userId: user.id,
          role: role,
        });
      });
      await this.userRoleRepository.save(rolesToInsert);
    }

    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
  }
}
