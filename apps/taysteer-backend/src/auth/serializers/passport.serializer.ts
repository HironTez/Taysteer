import fastifyPassport from 'fastify-passport';
import { FastifyRequest } from 'fastify/types/request';

export abstract class PassportSerializer {
  abstract serializeUser(user: any, request: FastifyRequest);
  abstract deserializeUser(payload: any, request: FastifyRequest);

  constructor() {
    const passportInstance = this.getPassportInstance();
    passportInstance.registerUserSerializer((user, request) => this.serializeUser(user, request));
    passportInstance.registerUserDeserializer((payload, request) => this.deserializeUser(payload, request));
  }

  getPassportInstance() {
    return fastifyPassport;
  }
}
