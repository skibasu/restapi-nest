// import { IsEmail, IsOptional, IsString } from 'class-validator';
import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { OrderStatus, PaymentType, Product } from '../types/orders.types';
import { Type } from 'class-transformer';
import { CreateOrderDtoProduct } from './create-order-dto';
class PatchOrderDtoAdress {
  @IsOptional()
  streetName: string;
  @IsOptional()
  houseNumber: string;
  @IsOptional()
  flatNumber: string;
  @IsOptional()
  city: string;
}

export class PatchOrderDtoPhoneNumber {
  @IsOptional()
  number: string;
  @IsOptional()
  prefix: string;
}
export class PatchOrderDto {
  @IsOptional()
  @IsString()
  title: string;
  @IsOptional()
  @IsObject()
  adress: PatchOrderDtoAdress;
  @IsOptional()
  @Type(() => PatchOrderDtoPhoneNumber)
  phoneNumber: PatchOrderDtoPhoneNumber;
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  @IsObject({ each: true })
  @Type(() => CreateOrderDtoProduct)
  products: Product[];
  @IsOptional()
  @IsNumber()
  price: number;
  @IsOptional()
  @IsString()
  paymentType: PaymentType;
  @IsOptional()
  @IsEnum(OrderStatus)
  status: OrderStatus;
  @ValidateIf(({ status }) => status === OrderStatus.SELECTED)
  @IsMongoId()
  selectedBy: string;
}

export class WSPatchOrderDto {
  @IsMongoId()
  id: string;
  @IsOptional()
  @IsString()
  title: string;
  @IsOptional()
  @IsObject()
  adress: PatchOrderDtoAdress;
  @IsOptional()
  @Type(() => PatchOrderDtoPhoneNumber)
  phoneNumber: PatchOrderDtoPhoneNumber;
  @IsOptional()
  @IsDefined()
  @ArrayMinSize(1)
  @ValidateNested()
  @IsObject({ each: true })
  @Type(() => CreateOrderDtoProduct)
  products: Product[];
  @IsOptional()
  @IsNumber()
  price: number;
  @IsOptional()
  @IsString()
  paymentType: PaymentType;
  @IsOptional()
  @IsEnum(OrderStatus)
  status: OrderStatus;
  @ValidateIf(({ status }) => status === OrderStatus.SELECTED)
  @IsMongoId()
  selectedBy: string;
}
