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

enum ActionMesseges {
  CREATE_ORDER = 'createOrder',
  UPDATE_ORDER = 'updateOrder',
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

  handleConnection(client: Socket, ...args: any[]) {
    const sockets = this.io.sockets;
    this.logger.log(`Client conneted, id = ${client.id}`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);

    this.io.emit('hallo', client.id);
  }
  handleDisconnect(client: Socket) {
    const sockets = this.io.sockets;

    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
    this.logger.log(`Client disconneted, id = ${client.id}`);
  }

  @UseFilters(new WsAndHttpExceptionFilter())
  @SubscribeMessage(ActionMesseges.UPDATE_ORDER)
  async updateOrder(@MessageBody(ValidationPipe) data: WSPatchOrderDto) {
    const { id, ...rest } = data;
    const result = await this.ordersService.updateOrder(id, rest);
    this.io.emit(ActionMesseges.UPDATE_ORDER, result);
  }

  @UseFilters(new WsAndHttpExceptionFilter())
  @SubscribeMessage(ActionMesseges.CREATE_ORDER)
  async createOrder(
    @MessageBody(ValidationPipe) data: CreateOrderDto,
    @ConnectedSocket() client: Socket & WsUser,
  ) {
    const result = await this.ordersService.createOrder(data, client.user);
    const { status } = result;

    this.io.to(status).emit(ActionMesseges.CREATE_ORDER, result);
  }
}
