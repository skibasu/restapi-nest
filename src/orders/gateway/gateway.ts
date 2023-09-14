import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { Socket, Server, Namespace } from 'socket.io';
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

enum ActionMesseges {
  CREATE_ORDER = 'createOrder',
  UPDATE_ORDER = 'updateOrder',
  JOIN_ROOM = 'joinRoom',
}

@UsePipes(ValidationPipe)
@WebSocketGateway({ namespace: 'orders' })
export class Gateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() io: Namespace;

  private logger = new Logger('Gateway logger');

  constructor(private readonly ordersService: OrdersService) {}

  afterInit(server: Server) {
    this.logger.log('Init GATEWAY');
  }

  async handleConnection(client: Socket & WsUser, ...args: any[]) {
    const sockets = this.io.sockets;
    const io = this.io;
    const { role, userName, _id } = client.user;
    const loggedUsers = ['64d129d7d6c789a6d4b8ebdc'];

    this.logger.log(`Client conneted, id = ${client.id}`);
    if (matchRoles([UsersRole.ADMIN, UsersRole.MANAGER], role)) {
      [
        OrderStatus.DONE,
        OrderStatus.DRAFT,
        OrderStatus.OPEN,
        OrderStatus.PENDING,
        OrderStatus.SELECTED,
      ].forEach(async (room) => {
        await client.join(room);
        io.to(room).emit('room_in', `#${room}# Welcome ${userName}`);
      });
    }
    if (matchRoles([UsersRole.DRIVER], role)) {
      await client.join(OrderStatus.OPEN);
      io.to(OrderStatus.OPEN).emit(
        'room_in',
        `#${OrderStatus.OPEN}# Welcome ${userName}`,
      );
      [OrderStatus.DONE, OrderStatus.PENDING, OrderStatus.SELECTED].forEach(
        async (room) => {
          await client.join(`${room}_${_id}`);
          io.to(`${room}_${_id}`).emit(
            'room_in',
            `#${room}_${_id}# Welcome ${userName}`,
          );
        },
      );
    }

    //  this.logger.debug(`Number of connected sockets: ${sockets.size}`);

    //this.io.emit('room_in', `Welcome ${userName}`);
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
      selectedBy !== userId
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
}
