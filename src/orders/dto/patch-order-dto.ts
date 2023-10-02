// import { IsEmail, IsOptional, IsString } from 'class-validator';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsMongoId,
  IsObject,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsMongoIdOrNull } from 'src/users/validators/isMongoIdOrNull';
import { OrderStatus, PaymentType } from '../types/orders.types';
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
export class PatchOrderDto {
  @IsOptional()
  @IsString()
  title: string;
  @IsOptional()
  @IsObject()
  adress: PatchOrderDtoAdress;
  @IsOptional()
  @IsString()
  phoneNumber: string;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  products: string[];
  @IsOptional()
  @IsString()
  price: string;
  @IsOptional()
  @IsString()
  paymentType: PaymentType;
  @IsOptional()
  @IsEnum(OrderStatus)
  status: OrderStatus;
  @IsOptional()
  @Validate(IsMongoIdOrNull)
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
  @IsString()
  phoneNumber: string;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  products: string[];
  @IsOptional()
  @IsString()
  price: string;
  @IsOptional()
  @IsString()
  paymentType: PaymentType;
  @IsOptional()
  @IsEnum(OrderStatus)
  status: OrderStatus;
  @IsOptional()
  @Validate(IsMongoIdOrNull)
  selectedBy: string;
}
