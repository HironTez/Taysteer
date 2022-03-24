import { FastifyRequest } from 'fastify/types/request';
import { Injectable } from '@nestjs/common';
import { User } from '../../resources/users/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserT } from '../../resources/users/user.types';
import { PassportSerializer } from './passport.serializer';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<UserT>
  ) {
    super();
  }

  serializeUser(user: UserT, _request: FastifyRequest) {
    return user.id;
  }

  async deserializeUser(userId: string, _request: FastifyRequest) {
    const user = await this.userRepository.findOne(userId);
    return user;
  }
}
