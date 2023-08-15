import { IsMongoId, IsString } from 'class-validator';

export class UserIdDto {
  @IsString()
  id: string;
}
