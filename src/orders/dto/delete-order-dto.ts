import { IsEnum, IsMongoId, ValidateIf } from 'class-validator';
import { OrderStatus } from '../types/orders.types';

export class DeleteOrderDto {
  @IsMongoId()
  id: string;
  //   @IsEnum(OrderStatus)
  //   status: OrderStatus;
  //   @ValidateIf(({ status }) => status === OrderStatus.SELECTED)
  //   @IsMongoId()
  //   selectedBy: string;
}
