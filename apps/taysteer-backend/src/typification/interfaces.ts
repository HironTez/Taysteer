import { FastifyRequest } from 'fastify';
import { MultipartFile } from 'fastify-multipart';

export interface ExtendedRequest extends FastifyRequest {
  user: {
    id: string;
    login: string;
  };
}

export interface ExtendedMultipartFile extends MultipartFile {
  value?: any;
}
