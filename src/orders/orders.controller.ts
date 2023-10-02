import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UsersRole } from 'src/users/types/users-types';
import { CreateOrderDto } from './dto/create-order-dto';
import { GetOrdersFilterDto } from './dto/get-orders-filter-dto';
import { OrderIdDto } from './dto/order-id-dto';
import { PatchOrderDto } from './dto/patch-order-dto';
import { OrdersService } from './orders.service';
import { Order } from './schema/order.schema';
import { OrderStatus } from './types/orders.types';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @Get('/')
  @Roles(UsersRole.ADMIN, UsersRole.MANAGER)
  async getListOfOrders(
    @Query(ValidationPipe) filterDto: GetOrdersFilterDto,
  ): Promise<Order[]> {
    const filters = [{}];
    //    ? Object.keys(filterDto).map((key) => ({
    //        [key]: { $regex: filterDto[key], $options: 'i' },
    //      }))
    //    : [];
    return this.ordersService.getListOfOrders(filters);
  }

  @Get('/user')
  async getListOfUserOrders(@Request() req): Promise<Order[]> {
    return this.ordersService.getListOfUserOrders(req.user._id);
  }
  @Get('/board')
  async getOrdersBoard(): Promise<Order[]> {
    return this.ordersService.getListOfOrders([{ status: OrderStatus.OPEN }]);
  }

  @Post('/')
  async createOrder(
    @Request() req,
    @Body(ValidationPipe) order: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(order, req.user);
  }
  @Patch('/:id')
  async updateOrder(
    @Param(ValidationPipe) params: OrderIdDto,
    @Body(ValidationPipe) order: PatchOrderDto,
  ) {
    return this.ordersService.updateOrder(params.id, order);
  }
  @Delete('/:id')
  async deleteOrder(@Param(ValidationPipe) params: OrderIdDto) {
    return this.ordersService.deleteOrder(params.id);
  }
}
