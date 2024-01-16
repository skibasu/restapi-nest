import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UsersRole } from 'src/users/types/users-types';
import { CreateShiftDto } from './dto/create-shift-dto';

@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftService: ShiftsService) {}

  @Get('/')
  @Roles(UsersRole.ADMIN, UsersRole.MANAGER)
  async getShifts() {
    return this.shiftService.getShifts();
  }
  @Get('/active')
  @Roles(UsersRole.ADMIN, UsersRole.MANAGER)
  async getCurrentShift() {
    return this.shiftService.getShifts(true);
  }

  @Post('/')
  @Roles(UsersRole.ADMIN, UsersRole.MANAGER)
  async createShift(
    @Request() req,
    @Body(ValidationPipe) shift: CreateShiftDto,
  ) {
    return this.shiftService.createShift(shift, req.user);
  }
}
