import { ZodError } from "zod";

export const zodError = <T>(error: ZodError<T>) => ({
  success: false as false,
  errors: error.errors.map(({ message, path }) => ({
    message,
    path: path as string[],
  })),
});
