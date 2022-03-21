import { UserDataDto } from './../../resources/users/user.dto';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ExtendedRequest } from '../../typification/interfaces';

@Injectable()
export class FormGuard implements CanActivate {
  public async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest() as ExtendedRequest; // Get request
    // Check form data
    const isMultipart = req.isMultipart();
    if (!isMultipart) return false;
    // Set options for files
    const filesOptions: Object = {
      limits: { fileSize: 20000 },
    };
    // Extract form data
    const newData: UserDataDto = {};
    const parts = req.parts(filesOptions);
    if (!parts) return false;
    for await (const part of parts) { // For each field in the form
      if (!part.file) { // If it's not a file
        newData[part.fieldname] = part['value']; // Extract value
      } else { // If it's a file'
        for (const key of Object.keys(part.fields)) { // For each
          // Validate
          const field = part.fields[key];
          if (!field['file']) continue;
          if (!newData.files) newData.files = [];
          newData.files[field['fieldname']] = field['file']; // Extract write stream
        }
        break;
      };
    }
    req.formData = newData;
    return true;
  }
}
