import {
  IsString,
  IsMongoId,
  IsArray,
  ValidateIf,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class PatchShiftDto {
  @IsOptional()
  @IsString()
  title: string;
  @IsOptional()
  @ValidateIf(({ orders }) => orders.length > 0)
  @IsArray()
  @IsMongoId({ each: true })
  orders: string[];
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
