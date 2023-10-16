import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product } from './schema/product.schema';
import { CreateProductDto } from './dto/create-product-dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async getListOfProducts(): Promise<Product[]> {
    try {
      const result = await this.productModel.find().select({ __v: 0 }).exec();
      if (result.length === 0) {
        throw new NotFoundException('Not found.');
      }
      return result;
    } catch (e: any) {
      Logger.log(e);
      if (e.response.statusCode === 404) {
        throw new NotFoundException('Not found.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  async createProduct(product: CreateProductDto) {
    const newProduct = new this.productModel(product);
    try {
      const result = await newProduct.save();

      if (!result) {
        throw new NotFoundException('Product not saved');
      }

      return result;
    } catch (e: any) {
      Logger.log(e);
      if (e.response.statusCode === 404) {
        throw new NotFoundException('Product not saved');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
