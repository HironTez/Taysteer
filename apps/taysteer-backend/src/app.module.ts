import { RecipeModule } from './resources/recipes/recipe.module';
import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ReqLogMiddleware } from './middleware/req.log.middleware';
import { HttpErrorFilter } from './middleware/http-exception.filter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionOptions } from './ormconfig';
import { UserModule } from './resources/users/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(connectionOptions), AuthModule, UserModule, RecipeModule],
  providers: [HttpErrorFilter],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReqLogMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
