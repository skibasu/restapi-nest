import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request as IRequest } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(protected configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([RtStrategy.extractJWT]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SECRET'),
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
}
