import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  //IsPhoneNumber,
  IsUrl,
  Length,
  Matches,
  NotContains,
  Validate,
} from 'class-validator';
import { IsArrayOfEnumsOrString } from '../validators/isArrayOfEnumsOrString.decorator';
import { UsersRole } from '../types/users-types';

export class CreateUserDto {
  @IsNotEmpty()
  @Validate(IsArrayOfEnumsOrString)
  role: UsersRole | UsersRole[];

  @IsString()
  @NotContains(' ', { message: 'Spaces are not allowed.' })
  @Length(2, 100)
  firstName: string;

  @IsString()
  @Length(2, 100)
  @Matches(/^[^\s]+(\s+[^\s]+)*$/, {
    message: 'Spaces on the beginning and on the end are not allowed.',
  })
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
