import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/schema/user.schema';
import { Request as IRequest } from 'express';
import { ConfigService } from '@nestjs/config';
type JwtPayload = Pick<User, '_id' | 'firstName' | 'email'>;

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(protected configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([AtStrategy.extractJWT]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SECRET'),
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
      return req.cookies.access_token;
    }
    return null;
  }
}
