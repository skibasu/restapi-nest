import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UsersRole } from '../types/users-types';
import { Mongoose } from 'mongoose';

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
    type: mongoose.Schema.Types.Mixed,
    required: true,
    uppercase: true,
    validate: {
      validator: function (v: UsersRole | UsersRole[]) {
        if (!v) {
          return false;
        }
        if (typeof v === 'object' && v.length > 0) {
          v.forEach((element) => {
            if (!Object.keys(UsersRole).includes(element)) {
              return false;
            }
          });
        }
        if (typeof v === 'string' && !Object.keys(UsersRole).includes(v)) {
          return false;
        }
        return true;
      },
    },
  })
  role: UsersRole | UsersRole[];

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
