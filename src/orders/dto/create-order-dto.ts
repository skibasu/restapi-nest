// import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OrderStatus, PaymentType } from '../types/orders.types';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  streetName: string;
  @IsNotEmpty()
  @IsString()
  houseNumber: string;
  @IsNotEmpty()
  @IsString()
  flatNumber: string;
  @IsNotEmpty()
  @IsString()
  price: string;
  @IsNotEmpty()
  @IsString()
  paymentType: PaymentType;
  @IsOptional()
  @IsIn([OrderStatus.DRAFT, OrderStatus.OPEN])
  status: OrderStatus.DRAFT | OrderStatus.OPEN;
}
