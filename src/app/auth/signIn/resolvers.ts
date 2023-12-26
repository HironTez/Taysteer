import { signIn } from "@/app/internal-actions/auth";
import { SignInSchemaT, signInSchema } from "@/app/schemas/user";
import { zodError } from "@/utils/dto";

export const resolveSignIn = async (data: FormData) => {
  const parsed = signInSchema.safeParse(data);
  if (!parsed.success) return zodError<SignInSchemaT>(parsed.error);

  return await signIn(parsed.data.password);
};
