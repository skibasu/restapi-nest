import { Order } from '../schema/order.schema';

export interface Shift {
  _id: string;
  title: string;
  isActive: boolean;
  createdBy: string;
  orders: Order[];
}
