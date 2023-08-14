import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { UsersRole } from '../types/users-types';
const regex = /ADMIN|MANAGER|DRIVER/i;
export class GetUsersFilterDto {
  @IsOptional()
  @IsNotEmpty()
  @Matches(regex)
  //   @IsIn([UsersRole.ADMIN, UsersRole.DRIVER, UsersRole.MANAGER])
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
