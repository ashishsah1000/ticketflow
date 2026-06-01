import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from './guards/super-admin.guard';
import { Role } from '../roles/enums/role.enum';

@Controller('admin')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async findAllUsers() {
    return this.adminService.findAllUsers();
  }

  @Put('users/:id/roles')
  async updateUserRoles(@Param('id') id: string, @Body('roles') roles: Role[]) {
    return this.adminService.updateUserRoles(id, roles);
  }
}
