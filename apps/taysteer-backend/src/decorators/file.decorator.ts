import { ExtendedRequest } from './../typification/interfaces';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const FormData = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest() as ExtendedRequest;
    const formData = req.formData;
    return formData;
  }
);