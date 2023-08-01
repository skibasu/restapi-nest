import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.quard';
import { AuthGuard } from './auth/auth.guards';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://delivery_user:tereferekuku1@cluster0.r8wot.mongodb.net/delivery?retryWrites=true&w=majority',
    ),
    AuthModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: 3600 },
    }),
  ],
})
export class AppModule {}
