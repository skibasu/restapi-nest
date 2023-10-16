import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UsersRole } from 'src/users/types/users-types';
import { Product } from './schema/product.schema';
import { CreateProductDto } from './dto/create-product-dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/')
  @Roles(UsersRole.ADMIN, UsersRole.MANAGER)
  async getListOfProducts(): Promise<Product[]> {
    return this.productsService.getListOfProducts();
  }
  @Post('/')
  @Roles(UsersRole.ADMIN)
  async createProduct(@Body(ValidationPipe) product: CreateProductDto) {
    return this.productsService.createProduct(product);
  }
}
