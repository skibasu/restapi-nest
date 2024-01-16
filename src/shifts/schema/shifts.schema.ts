import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Order } from 'src/orders/schema/order.schema';
import { User } from 'src/users/schema/user.schema';

@Schema()
@Schema({ timestamps: true })
export class Shift {
  _id: string;
  @Prop({ type: String, required: true })
  title: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' })
  createdBy: User;
  @Prop({ type: Boolean, required: true })
  isActive: boolean;
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    required: false,
  })
  orders: Order[];

  //   @Prop({ type: Date, required: false })
  //   createdAt?: number;
  //   @Prop({ type: Date, required: false })
  //   updatedAt?: Date;
}

export const ShiftSchema = SchemaFactory.createForClass(Shift);
