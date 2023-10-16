import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { MenuProductType } from 'src/orders/types/menu-product-type';

@Schema()
export class Product {
  _id: string;
  @Prop({ type: String, required: true })
  title: string;
  @Prop({ type: String, required: true })
  picture: string;
  @Prop({ type: Number, required: true })
  price: number;
  @Prop({ type: String, required: true })
  description: string;
  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  type: MenuProductType;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
