import { ExtendedRequest } from './../typification/interfaces';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FormDataDto } from '../typification/dto';

export const FormData = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest() as ExtendedRequest;
    const formData = req.body;
    let newFormData: FormDataDto = {};
    for (const key of Object.keys(formData)) {
      const value = formData[key]?.value;
      const file = formData[key]?.file;
      if (value) newFormData[key] = value;
      else if (file) newFormData[key] = file;
    }
    return newFormData;
  }
);