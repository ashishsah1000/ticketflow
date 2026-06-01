import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Role } from '../enums/role.enum';

@Injectable()
export class EmployeeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (user && (user.admin === true || (user.roles && (user.roles.includes(Role.EMPLOYEE) || user.roles.includes(Role.MANAGER))))) {
      return true;
    }
    
    throw new ForbiddenException('Employee privileges required.');
  }
}
