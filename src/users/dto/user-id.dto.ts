import { IsMongoId } from 'class-validator';
//fixed
export class UserIdDto {
  @IsMongoId()
  id: string;
}
