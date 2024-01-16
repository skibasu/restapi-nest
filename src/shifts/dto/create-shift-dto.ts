import { IsNotEmpty, IsString } from 'class-validator';

export class CreateShiftDto {
  @IsNotEmpty()
  @IsString()
  title: string;
}
