import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Types } from 'mongoose';

@ValidatorConstraint({ name: 'IsMongoIdOrNull', async: false })
export class IsMongoIdOrNull implements ValidatorConstraintInterface {
  validate(v: string) {
    if (Types.ObjectId.isValid(v)) {
      return true;
    } else if (v === null) {
      return true;
    }
    return false;
  }

  defaultMessage() {
    // here you can provide default error message if validation failed
    return 'Mongo ID needts to be mongoId or null';
  }
}
