export class RegisterUserDataDto {
  readonly name?: string;
  readonly login?: string;
  readonly password?: string;
  readonly description?: string;
}

export class UserDataDto {
  readonly id?: string;
  readonly name?: string;
  readonly login?: string;
  readonly password?: string;
  readonly description?: string;
  readonly image?: string;
}
