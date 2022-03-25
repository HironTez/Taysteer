export class RegisterUserDataDto {
  readonly id?: string;
  readonly name?: string;
  readonly login?: string
  readonly password?: string;
  readonly description?: string;
  files?: Array<NodeJS.ReadableStream>
}