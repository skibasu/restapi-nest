import { Controller, ValidationPipe, Get, Query } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
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
}
