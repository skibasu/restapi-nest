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

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    userCredentialsDto: UserCredentialsDto,
  ): Promise<{ token: string; _id: string }> {
    const { email, password } = userCredentialsDto;
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }
    const hash = await bcrypt.hash(password, user.salt);
    const payload = {
      _id: user._id,
      userName: user.firstName,
      role: user.role,
    };

    if (await bcrypt.compare(password, hash))
      return {
        _id: user._id,
        token: await this.jwtService.signAsync(payload),
      };
    throw new UnauthorizedException();
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

    const result = await this.usersService.creatUser(user);

    if (!result) {
      throw new NotFoundException('User not saved');
    }
    return { message: 'User created' };
  }
}
