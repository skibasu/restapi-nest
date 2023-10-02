// import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsObject,
  IsArray,
  ArrayMinSize,
  IsMongoId,
  IsDefined,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { OrderStatus, PaymentType } from '../types/orders.types';
import { Type } from 'class-transformer';
export class CreateOrderDtoAdress {
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
  city: string;
  @IsOptional()
  @IsString()
  note: string;
}
export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateOrderDtoAdress)
  adress: CreateOrderDtoAdress;
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  products: string[];
  @IsNotEmpty()
  @IsString()
  price: string;
  @IsNotEmpty()
  @IsString()
  paymentType: PaymentType;
  @IsOptional()
  @IsMongoId()
  selectedBy: string;
  @IsOptional()
  @IsIn([OrderStatus.DRAFT, OrderStatus.OPEN, OrderStatus.SELECTED])
  status: OrderStatus.DRAFT | OrderStatus.OPEN | OrderStatus.SELECTED;
}
