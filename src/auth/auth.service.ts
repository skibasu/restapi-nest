import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/users/schema/user.schema';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { roleToUpperCase } from 'src/users/helpers/helpers';
import { jwtConstants } from './constants/constants';
import { Tokens } from 'src/orders/types/auth-types';
import { Response as IResponse } from 'express';
import { ConfigService } from '@nestjs/config';

const message = 'Bad credentials';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(
    userCredentialsDto: UserCredentialsDto,
    res: IResponse,
  ): Promise<{
    message: string /*timeOut: { token: number; refresh: number }*/;
  }> {
    const { email, password } = userCredentialsDto;
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException(message);
    }
    const hash = await bcrypt.hash(password, user.salt);
    const payload = {
      _id: user._id,
      userName: user.firstName,
      role: user.role,
    };

    if (hash === user.password) {
      const token = await this.getTokens(payload);
      await this.updateRefreshToken(user._id, token.refreshToken);
      res.cookie('access_token', token.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge:
          Number(this.configService.get<string>('TOKEN_EXPIRED_TIME')) +
          Number(this.configService.get<string>('TIME_OFFSET')),
      });
      res.cookie('refresh_token', token.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge:
          Number(this.configService.get<string>('REFRESH_TOKEN_EXPIRED_TIME')) +
          Number(this.configService.get<string>('TIME_OFFSET')),
      });
      res.cookie('_id', user._id.toString());
      res.cookie(
        'token',
        new Date().getTime() +
          Number(this.configService.get<string>('TOKEN_EXPIRED_TIME')),
      );
      res.cookie(
        'refresh',
        new Date().getTime() +
          Number(this.configService.get<string>('REFRESH_TOKEN_EXPIRED_TIME')),
      );
      return {
        message: 'Successed',
        //   timeOut: {
        //     token:
        //       new Date().getTime() +
        //       Number(this.configService.get<string>('TOKEN_EXPIRED_TIME')),

        //     refresh:
        //       new Date().getTime() +
        //       Number(
        //         this.configService.get<string>('REFRESH_TOKEN_EXPIRED_TIME'),
        //       ),
        //   },
      };
    }
    throw new UnauthorizedException(message);
  }

  async signUp(user: Partial<User>): Promise<{ message: string }> {
    const { email, phoneNumber, password } = user;
    const { conflict, message } = await this.usersService.checkIfUserIsUnique({
      email,
      phoneNumber,
    });
    if (conflict) throw new ConflictException(message);

    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);
    user.role = roleToUpperCase(user.role);

    const result = await this.usersService.creatUser(user);

    if (!result) {
      throw new NotFoundException('User not saved');
    }
    return { message: 'User created' };
  }

  async logOut(userId: string, res: IResponse) {
    await this.deleteRefreshToken(userId);

    res.cookie('access_token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: -1000,
    });
    res.cookie('refresh_token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: -1000,
    });
    res.cookie('_id', '', { maxAge: -1000 });
    return { message: 'Logout' };
  }

  async refreshToken(
    userId: string,
    refreshToken: string,
    res: IResponse,
  ): Promise<{ message: string }> {
    const user = await this.usersService.getUserSaltAndTokenByUserID(userId);

    if (!user) {
      throw new UnauthorizedException(message);
    }
    const payload = {
      _id: user._id,
      userName: user.firstName,
      role: user.role,
    };

    if (refreshToken !== user.refreshToken) {
      throw new UnauthorizedException(message);
    } else {
      const token = await this.getTokens(payload);
      await this.updateRefreshToken(user._id, token.refreshToken);
      res.cookie('access_token', token.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge:
          Number(this.configService.get<string>('TOKEN_EXPIRED_TIME')) +
          Number(this.configService.get<string>('TIME_OFFSET')),
      });
      res.cookie('refresh_token', token.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: Number(
          this.configService.get<string>('REFRESH_TOKEN_EXPIRED_TIME') +
            Number(this.configService.get<string>('TIME_OFFSET')),
        ),
      });
      res.cookie('_id', user._id.toString(), {
        maxAge: Number(
          this.configService.get<string>('REFRESH_TOKEN_EXPIRED_TIME') +
            Number(this.configService.get<string>('TIME_OFFSET')),
        ),
      });
      res.cookie(
        'token',
        new Date().getTime() +
          Number(this.configService.get<string>('TOKEN_EXPIRED_TIME')) +
          Number(this.configService.get<string>('TIME_OFFSET')),
      );
      res.cookie(
        'refresh',
        new Date().getTime() +
          Number(this.configService.get<string>('REFRESH_TOKEN_EXPIRED_TIME')) +
          Number(this.configService.get<string>('TIME_OFFSET')),
      );
      return {
        message: 'refreshed',
      };
    }
  }

  private async updateRefreshToken(userId: string, token: string) {
    //const refreshToken = await bcrypt.hash(token, 10);
    return await this.usersService.updateUserRefreshToken(userId, token);
  }

  private async deleteRefreshToken(userId: string) {
    return await this.usersService.updateUserRefreshToken(userId, null, true);
  }

  private async getTokens(payload: any): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(payload, {
        expiresIn:
          Number(this.configService.get<string>('TOKEN_EXPIRED_TIME')) +
          Number(this.configService.get<string>('TIME_OFFSET')),
        secret: jwtConstants.secret,
      }),
      await this.jwtService.signAsync(payload, {
        expiresIn:
          Number(this.configService.get<string>('REFRESH_TOKEN_EXPIRED_TIME')) +
          Number(this.configService.get<string>('TIME_OFFSET')),
        secret: jwtConstants.refreshSecret,
      }),
    ]);
    return { accessToken, refreshToken };
  }
}
