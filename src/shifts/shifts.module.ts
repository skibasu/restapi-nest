import { Module } from '@nestjs/common';
import { ShiftsController } from './shifts.controller';
import { ShiftsService } from './shifts.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Shift, ShiftSchema } from './schema/shifts.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Shift.name, schema: ShiftSchema }]),
  ],
  controllers: [ShiftsController],
  providers: [ShiftsService],
})
export class ShiftsModule {}
