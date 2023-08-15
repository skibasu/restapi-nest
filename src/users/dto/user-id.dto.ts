import { IsMongoId } from 'class-validator';

export class UserIdDto {
  @IsMongoId()
  id: string;
}
