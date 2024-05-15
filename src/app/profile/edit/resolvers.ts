import { editUser } from "@/app/internal-actions/user";
import { EditProfileSchemaT, editUserSchema } from "@/app/schemas/user";
import { zodError } from "@/utils/dto";
import { User } from "@prisma/client";

export const resolveEditUser = async (targetUser: User, data: FormData) => {
  const parsed = editUserSchema.safeParse(data);
  if (!parsed.success) return zodError<EditProfileSchemaT>(parsed.error);
  return await editUser(
    targetUser,
    parsed.data.name ?? null,
    parsed.data.description ?? null,
    parsed.data.image,
    parsed.data.username,
    parsed.data.email,
  );
};
