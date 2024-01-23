import { IsMongoId } from 'class-validator';
//fixed
export class ShiftIdDto {
  @IsMongoId()
  id: string;
}
