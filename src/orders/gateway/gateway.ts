import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { Socket, Namespace } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OrdersService } from '../orders.service';
import { CreateOrderDto } from '../dto/create-order-dto';
import { WsAndHttpExceptionFilter } from '../filters/ws-exception-filter';
import { WsUser } from 'src/socket-io-adapter';
import { WSPatchOrderDto } from '../dto/patch-order-dto';
import { matchRoles } from 'src/auth/quards/helpers/helpers';
import { UsersRole } from 'src/users/types/users-types';
import { OrderStatus } from '../types/orders.types';
import { DeleteOrderDto } from '../dto/delete-order-dto';

enum ActionMesseges {
  CREATE_ORDER = 'createOrder',
  UPDATE_ORDER = 'updateOrder',
  DELETE_ORDER = 'deleteOrder',
  JOIN_ROOM = 'joinRoom',
}

@UsePipes(ValidationPipe)
@WebSocketGateway({
  namespace: 'orders',
})
export class Gateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() io: Namespace;

  private logger = new Logger('Gateway logger');

  constructor(private readonly ordersService: OrdersService) {}

  afterInit() {
    this.logger.log('Init GATEWAY');
  }

  async handleConnection(client: Socket & WsUser, ...args: any[]) {
    const io = this.io;
    const { role, userName, _id } = client.user;

    this.logger.log(`Client conneted, id = ${client.id}`);
    if (matchRoles([UsersRole.ADMIN, UsersRole.MANAGER], role)) {
      console.log('Match role');
      [
        OrderStatus.DONE,
        OrderStatus.DRAFT,
        OrderStatus.OPEN,
        OrderStatus.PENDING,
        OrderStatus.SELECTED,
      ].forEach(async (room) => {
        await client.join(room);
        io.to(room).emit('joinRoom', `#${room}# Welcome ${userName}`);
      });
    }
    if (matchRoles([UsersRole.DRIVER], role)) {
      await client.join(OrderStatus.OPEN);
      io.to(OrderStatus.OPEN).emit(
        'joinRoom',
        `#${OrderStatus.OPEN}# Welcome ${userName}`,
      );
      [OrderStatus.DONE, OrderStatus.PENDING, OrderStatus.SELECTED].forEach(
        async (room) => {
          await client.join(`${room}_${_id}`);
          io.to(`${room}_${_id}`).emit(
            'joinRoom',
            `#${room}_${_id}# Welcome ${userName}`,
          );
        },
      );
    }
  }
  handleDisconnect(client: Socket) {
    const sockets = this.io.sockets;

    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
    this.logger.log(`Client disconneted, id = ${client.id}`);
  }

  @UseFilters(new WsAndHttpExceptionFilter())
  @SubscribeMessage(ActionMesseges.UPDATE_ORDER)
  async updateOrder(
    @MessageBody(ValidationPipe) data: WSPatchOrderDto,
    @ConnectedSocket() client: Socket & WsUser,
  ) {
    const { role, _id: userId } = client.user;
    const { id, ...rest } = data;

    const result = await this.ordersService.updateOrder(id, rest);
    const { status, selectedBy } = result;

    if (
      matchRoles([UsersRole.ADMIN, UsersRole.MANAGER], role) &&
      selectedBy &&
      selectedBy._id !== userId
    ) {
      this.io
        .to(`${status}_${selectedBy}`)
        .emit(ActionMesseges.UPDATE_ORDER, result);
      this.io.to(`${status}`).emit(ActionMesseges.UPDATE_ORDER, result);
    }
    if (matchRoles([UsersRole.ADMIN, UsersRole.MANAGER], role) && !selectedBy) {
      this.io.to(`${status}`).emit(ActionMesseges.UPDATE_ORDER, result);
    }
    if (matchRoles([UsersRole.DRIVER], role)) {
      this.io
        .to(`${status}_${userId}`)
        .emit(ActionMesseges.UPDATE_ORDER, result);
      this.io.to(`${status}`).emit(ActionMesseges.UPDATE_ORDER, result);
    }
  }

  @UseFilters(new WsAndHttpExceptionFilter())
  @SubscribeMessage(ActionMesseges.CREATE_ORDER)
  async createOrder(
    @MessageBody(ValidationPipe) data: CreateOrderDto,
    @ConnectedSocket() client: Socket & WsUser,
  ) {
    const { role } = client.user;
    const { selectedBy } = data;
    const result = await this.ordersService.createOrder(data, client.user);
    const { status } = result;

    if (matchRoles([UsersRole.ADMIN, UsersRole.MANAGER], role)) {
      if (selectedBy) {
        this.io
          .to(`${status}_${selectedBy}`)
          .emit(`${ActionMesseges.CREATE_ORDER}`, result);
      }
      this.io.to(status).emit(ActionMesseges.CREATE_ORDER, result);
    }
    if (matchRoles([UsersRole.DRIVER], role)) {
      this.io.to(status).emit(ActionMesseges.CREATE_ORDER, result);
      //this.io.to(status).emit(`${ActionMesseges.CREATE_ORDER}}`, result);
    }
  }

  @UseFilters(new WsAndHttpExceptionFilter())
  @SubscribeMessage(ActionMesseges.DELETE_ORDER)
  async deleteOrder(
    @MessageBody(ValidationPipe) data: DeleteOrderDto,
    @ConnectedSocket() client: Socket & WsUser,
  ) {
    console.log('deleting');
    const { role } = client.user;
    const result = await this.ordersService.deleteOrder(data.id);
    const {
      status: code,
      message,
      deleted: { selectedBy, status, _id },
    } = result;
    console.log('deleting result', result);
    const dataToSendBack = {
      statusCode: code,
      message,
      _id,
      status,
      selectedBy,
    };
    if (matchRoles([UsersRole.ADMIN, UsersRole.MANAGER], role)) {
      if (selectedBy) {
        this.io
          .to(`${status}_${selectedBy}`)
          .emit(`${ActionMesseges.DELETE_ORDER}`, dataToSendBack);
      }
      this.io.to(status).emit(ActionMesseges.DELETE_ORDER, dataToSendBack);
    }
  }
}
