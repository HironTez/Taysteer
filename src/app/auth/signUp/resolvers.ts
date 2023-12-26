import { signUp } from "@/app/internal-actions/auth";
import { SignUpSchemaT, signUpSchema } from "@/app/schemas/user";
import { zodError } from "@/utils/dto";

export const resolveSignUp = async (data: FormData) => {
  const parsed = signUpSchema.safeParse(data);
  if (!parsed.success) return zodError<SignUpSchemaT>(parsed.error);

  return await signUp(parsed.data.password, parsed.data.confirmPassword);
};
