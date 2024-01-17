import { editUser } from "@/app/internal-actions/user";
import { EditProfileSchemaT, editUserSchema } from "@/app/schemas/user";
import { UserWithImage } from "@/types/Models";
import { zodError } from "@/utils/dto";

export const resolveEditUser = async (
  targetUser: UserWithImage,
  data: FormData,
) => {
  const parsed = editUserSchema.safeParse(data);
  if (!parsed.success) return zodError<EditProfileSchemaT>(parsed.error);
  return await editUser(
    targetUser,
    parsed.data.name,
    parsed.data.description,
    parsed.data.image,
    parsed.data.username,
    parsed.data.email,
    parsed.data.password,
  );
};
