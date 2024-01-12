import { signIn } from "@/app/internal-actions/auth";
import { SignInSchemaT, signInSchema } from "@/app/schemas/auth";
import { zodError } from "@/utils/dto";

export const resolveSignIn = async (data: FormData, email: string) => {
  const parsed = signInSchema.safeParse(data);
  if (!parsed.success) return zodError<SignInSchemaT>(parsed.error);

  return await signIn(email, parsed.data.password);
};
