import { UsersRole } from 'src/users/types/users-types';

export const matchRoles = (
  acceptedRoles: UsersRole[],
  userRole: UsersRole | UsersRole[],
) => {
  if (typeof userRole === 'string') {
    if (!acceptedRoles.includes(userRole)) {
      return false;
    } else {
      return true;
    }
  }
  if (typeof userRole === 'object') {
    for (const role of acceptedRoles) {
      if (!userRole.includes(role as UsersRole)) {
        return false;
      } else {
        return true;
      }
    }
  }
};
