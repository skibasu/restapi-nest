import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.quard';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://delivery_user:tereferekuku1@cluster0.r8wot.mongodb.net/delivery?retryWrites=true&w=majority',
    ),
    AuthModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
