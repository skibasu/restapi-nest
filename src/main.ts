import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from './app.module';
import { AuthGuard } from './auth/quards/auth.guards';
import { RolesGuard } from './auth/quards/roles.quard';
import { HttpExceptionFilter } from './filters/http-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const reflector = app.get(Reflector);
  const jwtService = app.get(JwtService);

  app.useGlobalGuards(
    new AuthGuard(jwtService, reflector),
    new RolesGuard(reflector),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
