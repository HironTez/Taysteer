import { getSession } from "@/app/internal-actions/auth";
import { getUrl } from "@/app/internal-actions/url";
import { checkAccess, getUserBy } from "@/app/internal-actions/user";
import { EditProfileSchemaT } from "@/app/schemas/user";
import { ActionError } from "@/utils/dto";
import { urlMoveDownPath } from "@/utils/url";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { resolveEditUser } from "./resolvers";
import "./style.module.css";

type EditProps = {
  userId?: string;
};

let errors: ActionError<EditProfileSchemaT> = {};

export async function Edit({ userId }: EditProps) {
  const requestedUser = userId && (await getUserBy({ userId }));

  const session = await getSession();
  const hasAccess = await checkAccess(requestedUser, session);
  if (!hasAccess) redirect(urlMoveDownPath(getUrl()));

  const user = requestedUser || session;
  if (!user) notFound();

  const submit = async (data: FormData) => {
    "use server";
    const result = await resolveEditUser(user, data);
    if (result.success) {
      redirect(`/profile${userId ? `/${userId}` : ""}`);
    } else {
      errors = result.errors;
      revalidatePath(getUrl());
    }
  };
  return (
    <form action={submit}>
      Edit {userId ? `${user.username}'s` : "your"} profile
      <input name="image" placeholder="Image" type="file" />
      {errors.image && <p>{errors.image}</p>}
      <input name="name" placeholder="Name" />
      {errors.name && <p>{errors.name}</p>}
      <input name="username" placeholder="Username" />
      {errors.username && <p>{errors.username}</p>}
      <input name="description" placeholder="Description" />
      {errors.description && <p>{errors.description}</p>}
      <input name="email" placeholder="Email" type="email" />
      {errors.email && <p>{errors.email}</p>}
      <input name="password" placeholder="Password" type="password" />
      {errors.password && <p>{errors.password}</p>}
      <input name="confirmPassword" placeholder="Password" type="password" />
      {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
      {errors.global && <p>{errors.global}</p>}
      <input type="submit" />
    </form>
  );
}
