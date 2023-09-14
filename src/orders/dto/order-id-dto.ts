import { IsMongoId } from 'class-validator';
export class OrderIdDto {
  @IsMongoId()
  id: string;
}
