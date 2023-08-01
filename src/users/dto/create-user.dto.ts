import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  //IsPhoneNumber,
  IsUrl,
  Length,
  Matches,
} from 'class-validator';
import { UsersRole } from '../types/users-types';

export class CreateUserDto {
  @IsNotEmpty()
  @IsIn([UsersRole.ADMIN, UsersRole.DRIVER, UsersRole.MANAGER])
  role: UsersRole;

  @IsString()
  @Length(2, 100)
  firstName: string;

  @IsString()
  @Length(2, 100)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  //@IsPhoneNumber()
  phoneNumber: string;

  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message: 'Password to weak',
  })
  password: string;
}
