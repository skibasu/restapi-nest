import { IsMongoId, IsOptional } from 'class-validator';
import { OrderStatus, PaymentType } from '../types/orders.types';

export class GetOrdersFilterDto {
  @IsOptional()
  status: OrderStatus;
  @IsOptional()
  title: string;
  @IsOptional()
  streetName: string;
  @IsOptional()
  houseNumber: string;
  @IsOptional()
  flatNumber: string;
  @IsOptional()
  price: string;
  @IsOptional()
  paymentType: PaymentType;
  @IsOptional()
  addedBy: string;
  @IsOptional()
  selectedBy: string;
}
