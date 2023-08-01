import { SetMetadata } from '@nestjs/common';
import { UsersRole } from '../../users/types/users-types';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UsersRole[]) => SetMetadata(ROLES_KEY, roles);
