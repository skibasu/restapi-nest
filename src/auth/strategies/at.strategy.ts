import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants/constants';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/schema/user.schema';
import { Request as IRequest } from 'express';
type JwtPayload = Pick<User, '_id' | 'firstName' | 'email'>;

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }
  validate(payload: JwtPayload) {
    return payload;
  }
  private static extractJWT(req: IRequest) {
    if (
      req.cookies &&
      'access_token' in req.cookies &&
      req.cookies.access_token
    ) {
      //console.log('ACCES TOKEN AtStrategy', req.cookies.access_token);
      return req.cookies.access_token;
    }
    return null;
  }
}
