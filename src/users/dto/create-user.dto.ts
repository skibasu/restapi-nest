import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  //IsPhoneNumber,
  IsUrl,
  Length,
  Matches,
  Validate,
} from 'class-validator';
import { IsArrayOfEnumsOrString } from '../validators/isArrayOfEnumsOrString.decorator';
import { UsersRole } from '../types/users-types';

export class CreateUserDto {
  @IsNotEmpty()
  @Validate(IsArrayOfEnumsOrString)
  role: UsersRole | UsersRole[];

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
  @Length(6, 15)
  phoneNumber: string;

  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message: 'Password too weak',
  })
  password: string;
}
