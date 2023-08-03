import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { UsersRole } from '../types/users-types';

export class GetUsersFilterDto {
  @IsOptional()
  @IsNotEmpty()
  @IsIn([UsersRole.ADMIN, UsersRole.DRIVER, UsersRole.MANAGER])
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
