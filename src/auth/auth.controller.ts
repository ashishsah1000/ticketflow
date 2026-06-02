// src/auth/auth.controller.ts

import {
    Body,
    Controller,
    Post,
    Get,
    Req,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Public()
    @Post('register')
    async register(
        @Body() registerDto: RegisterDto,
    ) {
        return this.authService.createUser(
            registerDto,
        );
    }

    @Public()
    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
    ) {
        return this.authService.login(
            loginDto,
        );
    }

    @Get('me')
    async me(@Req() req: any) {
        const user = await this.authService.findById(req.user.sub);
        if (user) {
            return {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                phone: user.phone,
                status: user.status,
                admin: user.admin,
                roles: req.user.roles || []
            };
        }
        return req.user;
    }
}