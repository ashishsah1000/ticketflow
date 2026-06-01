import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/roles/entities/user-role.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserRole)
        private readonly userRoleRepository: Repository<UserRole>,
        private readonly jwtService: JwtService,
    ) { }

    // create user function
    async createUser(registerDto: RegisterDto) {
        const existingEmail = await this.findByEmail(
            registerDto.email,
        );

        if (existingEmail) {
            throw new BadRequestException(
                'Email already exists',
            );
        }

        const existingPhone = await this.findByPhone(
            registerDto.phone,
        );

        if (existingPhone) {
            throw new BadRequestException(
                'Phone already exists',
            );
        }

        const hashedPassword = await bcrypt.hash(
            registerDto.password,
            4,
        );

        const user = this.userRepository.create({
            firstname: registerDto.firstname,
            lastname: registerDto.lastname,
            email: registerDto.email,
            phone: registerDto.phone,
            password: hashedPassword,
        });

        const savedUser =
            await this.userRepository.save(user);

        return {
            id: savedUser.id,
            firstname: savedUser.firstname,
            lastname: savedUser.lastname,
            email: savedUser.email,
            phone: savedUser.phone,
            status: savedUser.status,
            admin: savedUser.admin,
            created_at: savedUser.created_at,
        };
    }

    private sanitizeUser(user: User) {
        return {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phone: user.phone,
            admin: user.admin,
            status: user.status,
            created_at: user.created_at,
        };
    }


    async login(loginDto: LoginDto) {
        const user = await this.findByEmailWithPassword(
            loginDto.email,
        );


        if (!user) {
            throw new UnauthorizedException(
                'Invalid email or password',
            );
        }
        const roles =
            await this.userRoleRepository.find({
                where: {
                    user: { id: user.id },
                },
            });
        const roleNames =
            roles.map(r => r.role);
        const passwordMatched =
            await this.validatePassword(
                loginDto.password,
                user.password,
            );

        if (!passwordMatched) {
            throw new UnauthorizedException(
                'Invalid email or password',
            );
        }

        if (user.status !== 'active') {
            throw new UnauthorizedException(
                'User account is disabled',
            );
        }

        const payload = {
            sub: user.id,
            email: user.email,
            admin: user.admin,
            roles: roleNames,
            firstname: user.firstname,
            lastname: user.lastname,
            phone: user.phone
        };

        return {
            access_token:
                await this.jwtService.signAsync(payload),
        };
    }
    async validatePassword(
        plainPassword: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return bcrypt.compare(
            plainPassword,
            hashedPassword,
        );
    }

    async findByEmailWithPassword(
        email: string,
    ) {
        return this.userRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.email = :email', {
                email,
            })
            .getOne();
    }

    async findByEmail(email: string) {
        return this.userRepository.findOne({
            where: { email },
        });
    }

    async findByPhone(phone: string) {
        return this.userRepository.findOne({
            where: { phone },
        });
    }

    async findById(id: string) {
        return this.userRepository.findOne({
            where: { id },
        });
    }
}