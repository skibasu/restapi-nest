import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  IsIn,
  IsUrl,
} from 'class-validator';

import { MenuProductType } from 'src/orders/types/menu-product-type';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  title: string;
  @IsNotEmpty()
  @IsUrl()
  picture: string;
  @IsNotEmpty()
  @IsNumber()
  price: number;
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  description: string;
  @IsNotEmpty()
  @IsIn([MenuProductType.DRINKS, MenuProductType.PIZZA, MenuProductType.OTHERS])
  type: MenuProductType;
}
