import fastifyPassport from 'fastify-passport';
import { FastifyRequest } from 'fastify/types/request';
import { UserMinT } from '../../resources/users/user.types';

export abstract class PassportSerializer {
  abstract serializeUser(user: UserMinT, request: FastifyRequest);
  abstract deserializeUser(userId: string, request: FastifyRequest);

  constructor() {
    const passportInstance = this.getPassportInstance();
    passportInstance.registerUserSerializer((user: UserMinT, request) => this.serializeUser(user, request));
    passportInstance.registerUserDeserializer((userId: string, request) => this.deserializeUser(userId, request));
  }

  getPassportInstance() {
    return fastifyPassport;
  }
}
