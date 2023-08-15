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
  NotContains,
  Validate,
} from 'class-validator';
import { UsersRole } from '../types/users-types';
import { IsArrayOfEnumsOrString } from '../validators/isArrayOfEnumsOrString.decorator';

export class PatchUserDto {
  @IsOptional()
  @Validate(IsArrayOfEnumsOrString)
  role: UsersRole | UsersRole[];

  @IsOptional()
  @IsString()
  @NotContains(' ', { message: 'Spaces are not allowed.' })
  @Length(2, 100)
  firstName: string;

  @IsOptional()
  @IsString()
  @Matches(/^[^\s]+(\s+[^\s]+)*$/, {
    message: 'Spaces on the beginning and on the end are not allowed.',
  })
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
