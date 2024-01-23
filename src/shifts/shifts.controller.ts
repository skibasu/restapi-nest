import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UsersRole } from 'src/users/types/users-types';
import { CreateShiftDto } from './dto/create-shift-dto';
import { ShiftIdDto } from './dto/shift-id.dto';

@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftService: ShiftsService) {}

  @Get('/')
  @Roles(UsersRole.ADMIN, UsersRole.MANAGER)
  async getShifts() {
    return this.shiftService.getShifts(false);
  }
  @Get('/active')
  @Roles(UsersRole.ADMIN, UsersRole.MANAGER)
  async getCurrentShift() {
    return this.shiftService.getShifts(true);
  }

  @Get('/:id')
  @Roles(UsersRole.ADMIN, UsersRole.MANAGER)
  async getShiftById(@Param(ValidationPipe) params: ShiftIdDto) {
    return this.shiftService.getShiftByID(params.id);
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
