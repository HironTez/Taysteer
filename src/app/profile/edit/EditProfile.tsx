import { authGuard } from "@/app/internal-actions/auth";
import { revalidatePage } from "@/app/internal-actions/url";
import { checkAccess, getUserById } from "@/app/internal-actions/user";
import { variable } from "@/app/internal-actions/variables";
import { EditProfileSchemaT } from "@/app/schemas/user";
import { ActionError } from "@/utils/dto";
import { notFound, redirect } from "next/navigation";
import "./edit-profile.module.css";
import { resolveEditUser } from "./resolvers";

type EditProfileProps = {
  userId?: string;
};

const errorsVariable = variable<ActionError<EditProfileSchemaT>>("errors");

export async function EditProfile({ userId }: EditProfileProps) {
  const requestedUser = userId ? await getUserById(userId) : null;
  const sessionUser = await authGuard();

  if (userId && !requestedUser) notFound();

  const user = requestedUser || sessionUser;

  const viewerHasAccess = await checkAccess(sessionUser, user);
  if (!viewerHasAccess) return "403 forbidden";

  const errors = errorsVariable.get() ?? {};

  const submit = async (data: FormData) => {
    "use server";

    const result = await resolveEditUser(user, data);
    if (result.success) {
      redirect(`/profile${userId ? `/${userId}` : ""}`);
    } else {
      errorsVariable.set(result.errors);
      revalidatePage();
    }
  };
  return (
    <form action={submit}>
      Edit {userId ? `${user.username}'s` : "your"} profile
      <input name="image" placeholder="Image" type="file" />
      {errors.image && <p>{errors.image}</p>}
      <input
        name="name"
        placeholder="Name"
        defaultValue={user.name ?? ""}
        maxLength={50}
      />
      {errors.name && <p>{errors.name}</p>}
      <input
        name="username"
        placeholder="Username"
        defaultValue={user.username}
        maxLength={20}
      />
      {errors.username && <p>{errors.username}</p>}
      <input
        name="description"
        placeholder="Description"
        defaultValue={user.description ?? ""}
        maxLength={500}
      />
      {errors.description && <p>{errors.description}</p>}
      <input
        name="email"
        placeholder="Email"
        type="email"
        defaultValue={user.email}
        maxLength={254}
      />
      {errors.email && <p>{errors.email}</p>}
      {errors.global && <p>{errors.global}</p>}
      <input type="submit" />
    </form>
  );
}
