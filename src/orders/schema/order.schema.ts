import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { OrderStatus, PaymentType, Products } from '../types/orders.types';
import { User } from 'src/users/schema/user.schema';

@Schema()
export class Adress {
  @Prop({ type: String, required: true })
  streetName: string;
  @Prop({ type: String, required: true })
  houseNumber: string;
  @Prop({ type: String, required: true })
  flatNumber: string;
  @Prop({ type: String, required: false })
  note: string;
  @Prop({ type: String, required: true })
  city: string;
}

export class Actions {
  editable: boolean;
  deletable: boolean;
}

@Schema()
export class Order {
  _id: string;
  @Prop({
    type: mongoose.Schema.Types.Mixed,
    required: false,
    default: { editable: true, deletable: true },
  })
  actions: Actions;
  @Prop({ type: Adress, required: true })
  adress: Adress;
  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  status: OrderStatus;
  @Prop({ type: String, required: true })
  title: string;
  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  products: Products;
  @Prop({ type: String, required: true })
  phoneNumber: string;
  @Prop({ type: String, required: true })
  price: string;
  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  paymentType: PaymentType;
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' })
  acceptedBy: User;
  @Prop({ type: Boolean, required: true })
  isAccepted: boolean;
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  addedBy: User;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'User',
    default: null,
  })
  selectedBy: User | null;
  @Prop({ type: Number, required: false, default: new Date().getTime() })
  createdAt: number;
  @Prop({ type: Date, required: false })
  updatedAt: Date;
  @Prop({ type: Date, required: false })
  deletedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
