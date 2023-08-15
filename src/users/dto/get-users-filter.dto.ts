import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { UsersRole } from '../types/users-types';
import { IsArrayOfEnumsOrString } from '../validators/isArrayOfEnumsOrString.decorator';

export class GetUsersFilterDto {
  @IsOptional()
  @IsNotEmpty()
  @Validate(IsArrayOfEnumsOrString)
  role: UsersRole;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  firstName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  lastName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  phoneNumber: string;
}
