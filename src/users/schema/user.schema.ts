import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UsersRole } from '../types/users-types';

@Schema()
export class User {
  _id: string;

  @Prop({ type: String, required: true })
  email: string;
  @Prop({ type: String, required: true })
  firstName: string;
  @Prop({ type: String, required: true })
  lastName: string;
  @Prop({ type: String, required: true })
  phoneNumber: string;
  @Prop({ type: String, required: false, default: '' })
  avatar: string;
  @Prop({
    type: String,
    required: true,
    uppercase: true,
    enum: [UsersRole.ADMIN, UsersRole.DRIVER, UsersRole.MANAGER],
  })
  role: UsersRole;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    required: true,
  })
  salt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
