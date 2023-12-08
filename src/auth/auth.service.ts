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

const message = 'Bad credentials';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    userCredentialsDto: UserCredentialsDto,
  ): Promise<{ token: Tokens; _id: string }> {
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
      return {
        _id: user._id,
        token: await this.getTokens(payload),
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

  async logOut(userId: string) {
    await this.deleteRefreshToken(userId);
    return { message: 'Logout' };
  }

  async refreshToken(userId: string, refreshToken: string) {
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
      return token;
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
        expiresIn: 60 * 60,
        secret: jwtConstants.secret,
      }),
      await this.jwtService.signAsync(payload, {
        expiresIn: 60 * 60 * 12,
        secret: jwtConstants.refreshSecret,
      }),
    ]);
    return { accessToken, refreshToken };
  }
}
