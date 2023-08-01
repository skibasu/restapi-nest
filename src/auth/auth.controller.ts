import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  SetMetadata,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/schema/user.schema';
import { UsersRole } from 'src/users/types/users-types';
import { AuthGuard } from './auth.guards';
import { AuthService } from './auth.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.quard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signin')
  @UsePipes(ValidationPipe)
  async signIn(@Body() userCredential: UserCredentialsDto): Promise<any> {
    const { email, password } = userCredential;
    return this.authService.signIn({ email, password });
  }

  @Post('/signup')
  @UsePipes(ValidationPipe)
  async createUser(@Body() user: CreateUserDto) {
    return this.authService.signUp(user);
  }

  @UseGuards(AuthGuard, RolesGuard)
  // No access to reguest user object added in AuthGuard
  @Get('/profile')
  @Roles(UsersRole.ADMIN)
  getProfile(@Request() req) {
    console.log(req.user);
    return req.user;
  }
}
