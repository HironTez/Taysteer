import { FastifyRequest } from 'fastify';

export interface ExtendedRequest extends FastifyRequest {
  user: {
    id: string;
    login: string;
  };
}