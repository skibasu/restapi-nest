// import { IsEmail, IsOptional, IsString } from 'class-validator';
import { IsIn, IsMongoId, IsOptional, IsString } from 'class-validator';
import { OrderStatus, PaymentType } from '../types/orders.types';

export class PatchOrderDto {
  @IsOptional()
  @IsString()
  title: string;
  @IsOptional()
  @IsString()
  streetName: string;
  @IsOptional()
  @IsString()
  houseNumber: string;
  @IsOptional()
  @IsString()
  flatNumber: string;
  @IsOptional()
  @IsString()
  price: string;
  @IsOptional()
  @IsString()
  paymentType: PaymentType;
  @IsOptional()
  @IsIn([
    OrderStatus.DRAFT,
    OrderStatus.OPEN,
    OrderStatus.PENDING,
    OrderStatus.SELECTED,
    OrderStatus.DONE,
  ])
  status: OrderStatus;
}

export class WSPatchOrderDto {
  @IsMongoId()
  id: string;
  @IsOptional()
  @IsString()
  title: string;
  @IsOptional()
  @IsString()
  streetName: string;
  @IsOptional()
  @IsString()
  houseNumber: string;
  @IsOptional()
  @IsString()
  flatNumber: string;
  @IsOptional()
  @IsString()
  price: string;
  @IsOptional()
  @IsString()
  paymentType: PaymentType;
  @IsOptional()
  @IsIn([
    OrderStatus.DRAFT,
    OrderStatus.OPEN,
    OrderStatus.PENDING,
    OrderStatus.SELECTED,
    OrderStatus.DONE,
  ])
  status: OrderStatus;
}
