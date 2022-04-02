import { UserRating } from './user.rating.model';
import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.model';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRating])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UserModule {}
