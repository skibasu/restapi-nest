import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {
  MenuProductType,
  OrderStatus,
  PaymentType,
} from '../types/orders.types';
import { User } from 'src/users/schema/user.schema';
import { Shift } from 'src/shifts/schema/shifts.schema';

@Schema()
export class PhoneNumber {
  @Prop({ type: String, required: true })
  prefix: string;
  @Prop({ type: String, required: true })
  number: string;
}
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
export class Product {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  _id: string;
  @Prop({ type: String, required: true })
  title: string;
  @Prop({ type: Number, required: true })
  price: number;
  @Prop({ type: String, required: true })
  description: string;
  @Prop({ type: String, required: true })
  picture: string;
  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  type: MenuProductType;
  @Prop({ type: Number, required: true })
  counter: number;
}

@Schema({ timestamps: true })
export class Order {
  _id: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Shift', required: true })
  shiftId: Shift['_id'];
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
  products: Product[];
  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  phoneNumber: PhoneNumber;
  @Prop({ type: Number, required: true })
  price: number;
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
  @Prop({ type: Date, required: false })
  createdAt?: number;
  @Prop({ type: Date, required: false })
  updatedAt?: Date;
  @Prop({ type: Date, required: false })
  deletedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
