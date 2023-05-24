import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { PrismaService } from './db/prisma.service';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
