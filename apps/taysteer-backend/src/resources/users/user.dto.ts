export class RegisterUserDataDto {
  readonly name?: string;
  readonly login?: string;
  readonly password?: string;
  readonly description?: string;
}

export class UserDataDto {
  id?: string;
  name?: string;
  login?: string;
  password?: string;
  description?: string;
  image?: string;
}
