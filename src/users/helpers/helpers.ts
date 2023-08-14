import { UsersRole } from 'src/users/types/users-types';

export const roleToUpperCase = (role: UsersRole | UsersRole[]) => {
  if (typeof role === 'object' && role.length > 0) {
    return role.map((v) => v.toUpperCase());
  } else if (typeof role === 'string') {
    return role.toUpperCase();
  }
};
