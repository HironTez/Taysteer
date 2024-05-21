import { changePassword } from "@/app/internal-actions/user";
import {
  ChangePasswordSchemaT,
  changePasswordSchema,
} from "@/app/schemas/user";
import { zodError } from "@/utils/dto";
import { User } from "@prisma/client";

export const resolveChangePassword = async (data: FormData, user: User) => {
  const parsed = changePasswordSchema.safeParse(data);
  if (!parsed.success) return zodError<ChangePasswordSchemaT>(parsed.error);

  return await changePassword(
    user,
    parsed.data.oldPassword,
    parsed.data.password,
  );
};
