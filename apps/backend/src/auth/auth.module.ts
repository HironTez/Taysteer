import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalSerializer } from './serializers/local.serializer';
import { LocalStrategy } from './strategies/local.strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../db/prisma.service';

@Module({
  imports: [
    PassportModule.register({
      session: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, LocalSerializer, PrismaService],
})
export class AuthModule {}
