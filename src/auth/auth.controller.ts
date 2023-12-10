import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Get,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersRole } from 'src/users/types/users-types';
import { AuthService } from './auth.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { Roles } from './decorators/roles.decorator';
import { Public } from './decorators/public.decorator';
import { GetCurrentUser } from './decorators/get-current-user';
import { RtGuard } from './quards/rt.guard';
import { Response as IResponse, Request as IRequest } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(200)
  @Public()
  @Post('/signin')
  @UsePipes(ValidationPipe)
  async signIn(
    @Body() userCredential: UserCredentialsDto,
    @Res({ passthrough: true }) res: IResponse,
  ): Promise<any> {
    const { email, password } = userCredential;

    return this.authService.signIn({ email, password }, res);
  }

  @Post('/signup')
  @Roles(UsersRole.ADMIN, UsersRole.MANAGER)
  @UsePipes(ValidationPipe)
  async createUser(@Body() user: CreateUserDto) {
    return this.authService.signUp(user);
  }
  @HttpCode(200)
  @Post('/logout')
  @UsePipes(ValidationPipe)
  async logOut(@GetCurrentUser('_id') userId: string) {
    return this.authService.logOut(userId);
  }
  @Public()
  @UseGuards(RtGuard)
  @Get('/refresh')
  async refreshToken(
    @GetCurrentUser('_id') userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
    @Res() res,
  ) {
    return this.authService.refreshToken(userId, refreshToken, res);
  }
}
