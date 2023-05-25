import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { PrismaService } from './db/prisma.service';
import { ReqLogMiddleware } from './middleware/req.log.middleware';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Configure logger
    consumer.apply(ReqLogMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
