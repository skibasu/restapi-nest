import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersRole } from 'src/users/types/users-types';
import { AuthService } from './auth.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { Roles } from './decorators/roles.decorator';
import { Public } from './decorators/public.decorator';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(200)
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
}
