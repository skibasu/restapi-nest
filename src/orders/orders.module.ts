import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { Gateway } from './gateway/gateway';
import { Shift, ShiftSchema } from 'src/shifts/schema/shifts.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Shift.name, schema: ShiftSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, Gateway],
})
export class OrdersModule {}
