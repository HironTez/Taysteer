import { zodError } from "@/utils/dto";
import { logIn } from "../internal-actions/auth";
import { LogInSchemaT, loginSchema } from "../schemas/user";

export const resolveLogIn = async (data: FormData) => {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) return zodError<LogInSchemaT>(parsed.error);
  return await logIn(parsed.data.email);
};
