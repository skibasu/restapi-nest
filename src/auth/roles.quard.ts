import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersRole } from 'src/users/types/users-types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    console.log('Roles Guard');
    const requiredRoles = this.reflector.getAllAndOverride<UsersRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    return this.matchRoles(requiredRoles, user.role);
  }
  matchRoles(acceptedRoles: UsersRole[], userRole: UsersRole | UsersRole[]) {
    if (typeof userRole === 'string') {
      if (!acceptedRoles.includes(userRole)) {
        return false;
      }
    }
    if (typeof userRole === 'object') {
      for (const role of acceptedRoles) {
        if (!userRole.includes(role as UsersRole)) return false;
      }
    }
    return true;
  }
}
