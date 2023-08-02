import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  //IsPhoneNumber,
  IsUrl,
  Length,
} from 'class-validator';

export class PatchProfileDto {
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
  //@IsPhoneNumber()
  @Length(6, 15)
  phoneNumber: string;

  @IsOptional()
  @IsUrl()
  avatar: string;
}
