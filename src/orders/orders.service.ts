import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { matchRoles } from 'src/auth/quards/helpers/helpers';
import { UsersRole } from 'src/users/types/users-types';
import { CreateOrderDto } from './dto/create-order-dto';
import { PatchOrderDto } from './dto/patch-order-dto';
import { Order } from './schema/order.schema';
import { OrderStatus } from './types/orders.types';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async getListOfOrders(filterDto?: Partial<Order>[]): Promise<Order[]> {
    const filters = filterDto && filterDto.length ? { $and: filterDto } : {};
    try {
      const result = await this.orderModel
        .find(filters)
        .select({ __v: 0 })
        .exec();
      if (result.length === 0 || !result) {
        throw new NotFoundException('Not found.');
      }
      return result;
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async getListOfUserOrders(userId: string): Promise<Order[]> {
    try {
      const result = await this.orderModel
        .find({ selectedBy: userId })
        .select({ __v: 0 })
        .exec();
      return result;
    } catch (error: any) {
      throw new NotFoundException(`Nothing found`);
    }
  }
  async createOrder(order: CreateOrderDto, user: any): Promise<Order> {
    try {
      const isAccepted = matchRoles(
        [UsersRole.ADMIN, UsersRole.MANAGER],
        user.role,
      );

      const addedBy = user._id;
      const status = isAccepted
        ? order.status || OrderStatus.OPEN
        : OrderStatus.DRAFT;
      const acceptedBy = isAccepted ? { acceptedBy: addedBy } : {};
      const newOrder = new this.orderModel({
        ...order,
        ...acceptedBy,

        isAccepted,
        addedBy,
        status,
      });

      const result = await newOrder.save();

      if (!result) {
        throw new NotFoundException('Order not saved');
      }
      return result;
    } catch {
      throw new InternalServerErrorException();
    }
  }
  async updateOrder(_id: string, order: PatchOrderDto): Promise<Order> {
    if (Object.keys(order).length === 0)
      throw new BadRequestException("Order can't be empty");
    try {
      const result = await this.orderModel
        .findOneAndUpdate({ _id }, order, {
          returnOriginal: false,
        })
        .select({ __v: 0 })
        .exec();
      return result;
    } catch (error: any) {
      throw new NotFoundException(`Order with id: ${_id} not exist`);
    }
  }
  async deleteOrder(_id: string): Promise<{ status: number; message: string }> {
    try {
      const result = await this.orderModel.findOneAndDelete({ _id }).exec();

      if (!result) {
        throw new NotFoundException('Order not exist');
      }
      return { status: 200, message: `Order ${_id} deleted` };
    } catch (error: any) {
      throw new NotFoundException('Order not exist');
    }
  }
}
