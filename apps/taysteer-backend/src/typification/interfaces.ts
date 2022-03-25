import { FastifyRequest } from 'fastify';
import { RegisterUserDataDto } from '../resources/users/user.dto';

export interface ExtendedRequest extends FastifyRequest {
  user: {
    id: string;
    login: string;
  };
  formData: RegisterUserDataDto;
  fileStreams: AsyncIterableIterator<NodeJS.ReadableStream>
}