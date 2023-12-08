import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User, UserSchema } from './schema/user.schema';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';
import { AtStrategy } from 'src/auth/strategies/at.strategy';
import { RtStrategy } from 'src/auth/strategies/rt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  exports: [UsersService],
  imports: [
    PassportModule,
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService, AtStrategy, RtStrategy],
  controllers: [UsersController],
})
export class UsersModule {}
