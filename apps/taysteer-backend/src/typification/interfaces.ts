import { FastifyRequest } from 'fastify';
import { UserDataDto } from '../resources/users/user.dto';

export interface ExtendedRequest extends FastifyRequest {
  user: {
    id: string;
    login: string;
  };
  formData: UserDataDto;
  fileStreams: AsyncIterableIterator<NodeJS.ReadableStream>
}