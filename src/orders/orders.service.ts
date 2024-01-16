import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
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
import { ConfigService } from '@nestjs/config';
import { Shift } from 'src/shifts/schema/shifts.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Shift.name) private shiftModel: Model<Shift>,
    private configService: ConfigService,
  ) {}

  async getListOfOrders(filterDto?: Partial<Order>[]): Promise<Order[]> {
    const filters = filterDto && filterDto.length ? { $and: filterDto } : {};
    try {
      const result = await this.orderModel
        .find(filters)
        .sort({ createdAt: -1 })
        .select({ __v: 0 })
        .populate({
          path: 'selectedBy addedBy acceptedBy',
          select: ['firstName', 'lastName', 'avatar', 'phoneNumber', 'role'],
        })
        .exec();
      if (result.length === 0 || !result) {
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

  async getListOfUserOrders(userId: string): Promise<Order[]> {
    try {
      const result = await this.orderModel
        .find({ selectedBy: userId })
        .select({ __v: 0 })
        .populate({
          path: 'selectedBy addedBy acceptedBy',
          select: ['firstName', 'lastName', 'avatar', 'phoneNumber', 'role'],
        })
        .exec();
      return result;
    } catch (error: any) {
      throw new NotFoundException(`Nothing found`);
    }
  }
  async createOrder(order: CreateOrderDto, user: any): Promise<Order> {
    const { status, selectedBy } = order;
    try {
      const isAccepted =
        matchRoles([UsersRole.ADMIN, UsersRole.MANAGER], user.role) &&
        status !== OrderStatus.DRAFT;

      const addedBy = user._id;

      const selectedFor =
        selectedBy && isAccepted ? { selectedBy: order.selectedBy } : {};

      let orderStatus;

      if (isAccepted && selectedBy) {
        orderStatus = OrderStatus.SELECTED;
      } else if (isAccepted && !selectedBy) {
        orderStatus = OrderStatus.OPEN;
      } else if (!isAccepted) {
        orderStatus = OrderStatus.DRAFT;
      }

      const acceptedBy = isAccepted ? { acceptedBy: addedBy } : {};

      const newOrder = new this.orderModel({
        ...order,
        ...acceptedBy,
        ...selectedFor,

        isAccepted,
        addedBy,
        status: orderStatus,
      });

      const result = await newOrder.save();
      const result1 = await this.shiftModel.findByIdAndUpdate(order.shiftId, {
        $push: { orders: newOrder._id },
      });

      if (!result) {
        throw new NotFoundException('Order not saved');
      }
      if (!result1) {
        throw new NotFoundException('Order not saved in Shift');
      }

      return await result.populate({
        path: 'selectedBy addedBy acceptedBy',
        select: ['firstName', 'lastName', 'avatar', 'phoneNumber', 'role'],
      });
    } catch (e) {
      console.log(e);
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
        .populate({
          path: 'selectedBy addedBy acceptedBy',
          select: ['firstName', 'lastName', 'avatar', 'phoneNumber', 'role'],
        })
        .exec();
      return result;
    } catch (error: any) {
      throw new NotFoundException(`Order with id: ${_id} not exist`);
    }
  }
  async deleteOrder(_id: string): Promise<{
    status: number;
    message: string;
    deleted: Pick<Order, '_id' | 'status' | 'selectedBy' | 'title'>;
  }> {
    try {
      const result = await this.orderModel.findOneAndDelete({ _id }).exec();

      if (!result) {
        throw new NotFoundException('Order not exist');
      }
      return {
        status: 200,
        message: `Order ${_id} deleted`,
        deleted: {
          _id: result._id,
          title: result.title,
          status: result.status,
          selectedBy: result.selectedBy,
        },
      };
    } catch (error: any) {
      throw new NotFoundException('Order not exist');
    }
  }
}
