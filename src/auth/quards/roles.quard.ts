import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersRole } from 'src/users/types/users-types';
import { matchRoles } from './helpers/helpers';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UsersRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    const { user } = context.switchToHttp().getRequest();

    if (!requiredRoles) {
      return true;
    }
    if (!user) return false;
    return this.matchRoles(requiredRoles, user.role);
  }
  public matchRoles(
    acceptedRoles: UsersRole[],
    userRole: UsersRole | UsersRole[],
  ) {
    return matchRoles(acceptedRoles, userRole);
  }
}
