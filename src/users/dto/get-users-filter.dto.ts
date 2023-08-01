import { IsEmail, IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { UsersRole } from '../types/users-types';

export class GetUsersFilterDto {
  @IsOptional()
  @IsIn([UsersRole.ADMIN, UsersRole.DRIVER, UsersRole.MANAGER])
  role: UsersRole;

  @IsOptional()
  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  phoneNumber: string;
}
