import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './app.module';

import { RolesGuard } from './auth/quards/roles.quard';
import { HttpExceptionFilter } from './filters/http-exceptions.filter';
import { SocketIOAdapter } from './socket-io-adapter';
import { AtGuard } from './auth/quards/at.guard';

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
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');

  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));
  app.useGlobalGuards(new AtGuard(reflector), new RolesGuard(reflector));
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(PORT);
}
bootstrap();
