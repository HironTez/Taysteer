import { FastifyRequest } from 'fastify';

export interface ExtendedRequest extends FastifyRequest {
  user: {
    id: string;
    login: string;
  };
  incomingFile: MultipartFile;
}

export interface MultipartFile {
  toBuffer: () => Promise<Buffer>;
  file: NodeJS.ReadableStream;
  filepath: string;
  fieldname: string;
  filename: string;
  encoding: string;
  mimetype: string;
  fields: import('fastify-multipart').MultipartFields;
}