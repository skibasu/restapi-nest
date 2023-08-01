import {
  Controller,
  ValidationPipe,
  Get,
  Query,
  Request,
  Delete,
  Patch,
  Param,
  Body,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { UserIdDto } from './dto/user-id.dto';
import { User } from './schema/user.schema';
import { UsersRole } from './types/users-types';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(UsersRole.ADMIN)
  async getListOfUsers(
    @Query(ValidationPipe) filterDto: GetUsersFilterDto,
  ): Promise<User[]> {
    const filters = filterDto
      ? Object.keys(filterDto).map((key) => ({
          [key]: filterDto[key],
        }))
      : [];
    return this.usersService.getListOfUsers(filters);
  }

  @Get('/profile')
  getUserProfile(
    @Request() req,
    @Body(ValidationPipe) user: GetUsersFilterDto,
  ) {
    return this.usersService.updateUser(req.user._id, user);
  }

  @Patch('/profile')
  updateUserProfile(@Request() req) {
    return this.usersService.getUserByID(req.user._id);
  }

  @Patch('/:id')
  @Roles(UsersRole.ADMIN, UsersRole.MANAGER)
  async updateUserByID(
    @Param(ValidationPipe) params: UserIdDto,
    @Body(ValidationPipe) user: GetUsersFilterDto,
  ) {
    return this.usersService.updateUser(params.id, user);
  }

  @Delete('/:id')
  @Roles(UsersRole.ADMIN)
  async deleteUser(@Param(ValidationPipe) params: UserIdDto) {
    return this.usersService.deleteUser(params.id);
  }
}
