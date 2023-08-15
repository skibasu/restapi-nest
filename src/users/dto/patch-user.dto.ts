import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  //IsPhoneNumber,
  IsUrl,
  Length,
} from 'class-validator';
import { UsersRole } from '../types/users-types';

export class PatchUserDto {
  @IsOptional()
  @IsIn([UsersRole.ADMIN, UsersRole.DRIVER, UsersRole.MANAGER])
  role: UsersRole | UsersRole[];

  @IsOptional()
  @IsString()
  @Length(2, 100)
  firstName: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  lastName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  //@IsPhoneNumber()
  @Length(6, 15)
  phoneNumber: string;

  @IsOptional()
  @IsUrl()
  avatar: string;
}
