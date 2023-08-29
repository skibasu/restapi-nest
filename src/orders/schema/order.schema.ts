import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { OrderStatus, PaymentType } from '../types/orders.types';

@Schema()
export class Order {
  _id: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  status: OrderStatus;
  @Prop({ type: String, required: true })
  title: string;
  @Prop({ type: String, required: true })
  streetName: string;
  @Prop({ type: String, required: true })
  houseNumber: string;
  @Prop({ type: String, required: true })
  flatNumber: string;
  @Prop({ type: String, required: true })
  price: string;
  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  paymentType: PaymentType;

  @Prop({ type: String, required: false })
  acceptedBy: string;
  @Prop({ type: Boolean, required: true })
  isAccepted: boolean;
  @Prop({ type: String, required: true })
  addedBy: string;
  @Prop({ type: String, required: false })
  selectedBy: string;
  @Prop({ type: Date, required: false, default: new Date() })
  createdAt: Date;
  @Prop({ type: Date, required: false })
  updatedAt: Date;
  @Prop({ type: Date, required: false })
  deletedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
