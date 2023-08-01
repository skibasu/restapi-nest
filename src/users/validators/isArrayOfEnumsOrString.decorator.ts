import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersRole } from '../types/users-types';

@ValidatorConstraint({ name: 'IsArrayOfEnumsOrString', async: false })
export class IsArrayOfEnumsOrString implements ValidatorConstraintInterface {
  validate(v: UsersRole | UsersRole[]) {
    if (!v) {
      return false;
    }
    if (typeof v === 'object' && v.length > 0) {
      v.forEach((element) => {
        if (!Object.keys(UsersRole).includes(element)) {
          return false;
        }
      });
    }
    if (typeof v === 'string' && !Object.keys(UsersRole).includes(v)) {
      return false;
    }
    return true;
  }

  defaultMessage() {
    // here you can provide default error message if validation failed
    return 'Field role has bad value';
  }
}
