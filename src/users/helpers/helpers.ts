import { UsersRole } from 'src/users/types/users-types';

export const roleToUpperCase = (
  role: string | string[],
): UsersRole | UsersRole[] => {
  if (typeof role === 'object' && role.length > 0) {
    return role.map((v) => v.toUpperCase()) as UsersRole[];
  } else if (typeof role === 'string') {
    return role.toUpperCase() as UsersRole;
  }
};
