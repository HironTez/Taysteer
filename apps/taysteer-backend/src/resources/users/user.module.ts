import { Recipe } from './../recipes/recipe.model';
import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.model';

@Module({
  imports: [TypeOrmModule.forFeature([User, Recipe])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UserModule {}
