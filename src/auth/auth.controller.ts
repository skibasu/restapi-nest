import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersRole } from 'src/users/types/users-types';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { Roles } from './decorators/roles.decorator';
import { Public } from './decorators/public.decorator';
import { AuthGuard } from './auth.guards';
import { RolesGuard } from './roles.quard';

@UseGuards(AuthGuard, RolesGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}
  @Public()
  @Post('/signin')
  @UsePipes(ValidationPipe)
  async signIn(@Body() userCredential: UserCredentialsDto): Promise<any> {
    const { email, password } = userCredential;
    return this.authService.signIn({ email, password });
  }

  @Post('/signup')
  @Roles(UsersRole.ADMIN)
  @UsePipes(ValidationPipe)
  async createUser(@Body() user: CreateUserDto) {
    return this.authService.signUp(user);
  }

  //@UseGuards(AuthGuard, RolesGuard)
  @Roles(UsersRole.ADMIN)
  @Get('/profile')
  getProfile(@Request() req) {
    return this.usersService.getUserByID(req.user._id);
  }
}
