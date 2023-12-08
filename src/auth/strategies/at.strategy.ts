import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants/constants';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/schema/user.schema';

type JwtPayload = Pick<User, '_id' | 'firstName' | 'email'>;

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }
  validate(payload: JwtPayload) {
    return payload;
  }
}
