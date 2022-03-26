import { RegisterUserDataDto } from '../resources/users/user.dto';

export class LoginDataDto {
  readonly login!: string;
  readonly password!: string;
}

export class FormDataDto extends RegisterUserDataDto {
  [key: string]: string | NodeJS.ReadableStream;
}
