import { ExtendedRequest } from './../typification/interfaces';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const File = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest() as ExtendedRequest;
    const file = req.incomingFile;
    return file;
  }
);