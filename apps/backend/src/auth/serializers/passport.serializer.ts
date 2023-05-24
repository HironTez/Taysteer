import { FastifyRequest } from 'fastify/types/request';
import { User } from '@prisma/client';
import fastifyPassport from '@fastify/passport';

export abstract class PassportSerializer {
  abstract serializeUser(user: User, request: FastifyRequest): Promise<string>;
  abstract deserializeUser(
    userId: string,
    request: FastifyRequest,
  ): Promise<User | false>;

  constructor() {
    const passportInstance = this.getPassportInstance();
    passportInstance.registerUserSerializer((user: User, request) =>
      this.serializeUser(user, request),
    );
    passportInstance.registerUserDeserializer((userId: string, request) =>
      this.deserializeUser(userId, request),
    );
  }

  getPassportInstance() {
    return fastifyPassport;
  }
}
