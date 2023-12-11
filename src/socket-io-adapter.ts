import {
  INestApplicationContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions, Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { UsersRole } from './users/types/users-types';
export interface User {
  _id: string;
  role: UsersRole | UsersRole[];
  userName: string;
}
export interface WsUser {
  user: User;
}
export class SocketIOAdapter extends IoAdapter {
  private logger = new Logger(SocketIOAdapter.name);
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }
  createIOServer(port: number, options?: ServerOptions) {
    const jwtService = this.app.get(JwtService);

    this.logger.log('Socket IO configuring ...');
    const origin = this.configService.get<string>(
      'SOCKETIO.SERVER.CORS.ORIGIN',
    );
    options.cors = { origin: origin, credentials: true };
    const server: Server = super.createIOServer(port, options);

    server
      .of('orders')
      .use(createTokenMiddleware(jwtService, this.configService, this.logger));
    return server;
  }
}
const createTokenMiddleware =
  (jwtService: JwtService, configService: ConfigService, logger: Logger) =>
  async (socket: Socket & WsUser, next: (err?: ExtendedError) => void) => {
    const tokens = socket.handshake.headers.cookie || '';
    const arrOfTokens = tokens.split('; ');
    const accessTokenWithPrefix = arrOfTokens.find((c) =>
      c.match(/^access_token=.*$/),
    );

    const accessToken =
      accessTokenWithPrefix?.replace('access_token=', '') || '';

    const secret = configService.get('SECRET');

    logger.debug(`Validating token ${accessToken} before connection`);
    logger.debug(`Credentials ${accessToken} `);
    try {
      const { _id, userName, role } = await jwtService.verifyAsync(
        accessToken,
        {
          secret: secret,
        },
      );

      socket['user'] = { _id, userName, role };
      next();
    } catch {
      // for fix - no response error
      next(new UnauthorizedException());
    }
  };
