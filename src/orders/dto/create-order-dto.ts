// import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsObject,
  ArrayMinSize,
  IsMongoId,
  IsDefined,
  IsNotEmptyObject,
  ValidateNested,
  IsNumber,
  IsUrl,
  IsEnum,
  Min,
  IsArray,
  ValidateIf,
  IsNumberString,
  Matches,
} from 'class-validator';
import {
  MenuProductType,
  OrderStatus,
  PaymentType,
  Product,
} from '../types/orders.types';
import { Type } from 'class-transformer';
import { isNull } from 'util';
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
export class CreateOrderDtoPhoneNumber {
  @IsNotEmpty()
  @IsNumberString()
  number: string;
  @IsString()
  @Matches(/^\+\d*$/)
  prefix: string;
}
export class CreateOrderDtoProduct {
  @IsNotEmpty()
  @IsMongoId()
  _id: string;
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsNumber()
  price: number;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsUrl()
  @IsString()
  picture: string;
  @IsNotEmpty()
  @IsEnum(MenuProductType)
  type: MenuProductType;
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  counter: number;
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
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateOrderDtoPhoneNumber)
  phoneNumber: CreateOrderDtoPhoneNumber;
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  @IsObject({ each: true })
  @Type(() => CreateOrderDtoProduct)
  products: Product[];
  @IsNotEmpty()
  @IsNumber()
  price: number;
  @IsNotEmpty()
  @IsString()
  paymentType: PaymentType;
  @ValidateIf(({ status }) => status === OrderStatus.SELECTED)
  @IsMongoId()
  selectedBy: string;
  @IsIn([OrderStatus.DRAFT, OrderStatus.OPEN, OrderStatus.SELECTED])
  status: OrderStatus.DRAFT | OrderStatus.OPEN | OrderStatus.SELECTED;
}
