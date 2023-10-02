import { IsMongoId, IsObject, IsOptional } from 'class-validator';
import { OrderStatus, PaymentType } from '../types/orders.types';
class GetOrdersFilterDtoAdress {
  @IsOptional()
  streetName: string;
  @IsOptional()
  houseNumber: string;
  @IsOptional()
  flatNumber: string;
  @IsOptional()
  city: string;
}
export class GetOrdersFilterDto {
  @IsOptional()
  status: OrderStatus;
  @IsOptional()
  title: string;
  @IsOptional()
  @IsObject()
  adress: GetOrdersFilterDtoAdress;
  @IsOptional()
  phoneNumber: string;
  @IsOptional()
  price: string;
  @IsOptional()
  paymentType: PaymentType;
  @IsOptional()
  @IsMongoId()
  addedBy: string;
  @IsOptional()
  @IsMongoId()
  selectedBy: string;
}
