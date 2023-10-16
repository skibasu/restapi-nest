import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from './app.module';
import { AuthGuard } from './auth/quards/auth.guards';
import { RolesGuard } from './auth/quards/roles.quard';
import { HttpExceptionFilter } from './filters/http-exceptions.filter';
import { SocketIOAdapter } from './socket-io-adapter';

async function bootstrap() {
  //   const httpsOptions = {
  //     key: fs.readFileSync(process.cwd() + '/secret/private-key.pem'),
  //     cert: fs.readFileSync(process.cwd() + '/secret/public-certificate.pem'),
  //   };
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const reflector = app.get(Reflector);
  const jwtService = app.get(JwtService);
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');

  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));
  app.useGlobalGuards(
    new AuthGuard(jwtService, reflector),
    new RolesGuard(reflector),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(PORT);
}
bootstrap();
