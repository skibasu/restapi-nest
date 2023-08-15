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
} from 'class-validator';

export class PatchProfileDto {
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
  //@IsPhoneNumber()
  @Length(6, 15)
  phoneNumber: string;

  @IsOptional()
  @IsUrl()
  avatar: string;
}
