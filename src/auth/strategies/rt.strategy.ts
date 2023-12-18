import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants/constants';
import { Request as IRequest } from 'express';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([RtStrategy.extractJWT]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.refreshSecret,
      passReqToCallback: true,
    });
  }
  validate(req: IRequest, payload: any) {
    const refreshToken = RtStrategy.extractJWT(req);
    return { ...payload, refreshToken };
  }
  private static extractJWT(req: IRequest) {
    if (
      req.cookies &&
      'refresh_token' in req.cookies &&
      req.cookies.refresh_token
    ) {
      return req.cookies.refresh_token;
    }
    return null;
  }
  //   private extractTokenFromHeader(request: IRequest): string | undefined {
  //     const [type, token] = request.headers.authorization?.split(' ') ?? [];
  //     return type === 'Bearer' ? token : undefined;
  //   }
}
