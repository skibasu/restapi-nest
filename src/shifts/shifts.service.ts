import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Shift } from './schema/shifts.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { CreateShiftDto } from './dto/create-shift-dto';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectModel(Shift.name) private shiftModel: Model<Shift>,
    private configService: ConfigService,
  ) {}
  async getShifts(isActive: boolean = false) {
    try {
      const result = await this.shiftModel
        .find({ isActive })
        .sort({ createdAt: -1 })
        .select({ __v: 0 })
        .populate('orders')
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
  async createShift(shift: CreateShiftDto, user: any): Promise<Shift> {
    const createdBy = user._id;
    try {
      const isNotUnique = await this.shiftModel.findOne({ isActive: true });
      if (isNotUnique) {
        throw new BadRequestException(
          `Shift ${
            isNotUnique._id
          } with title ${isNotUnique.title.toUpperCase()} should be closed before you create new one.`,
        );
      }
      const newShift = new this.shiftModel({
        ...shift,
        createdBy,
        isActive: true,
      });

      const result = await newShift.save();
      if (!result) {
        throw new NotFoundException('Shift not saved');
      }

      return await result.populate({
        path: 'orders',
      });
    } catch (e) {
      throw e;
    }
  }
}
