import { unAuthGuard } from "@/app/internal-actions/auth";
import { getSearchParam, getUrl } from "@/app/internal-actions/url";
import { SignInSchemaT } from "@/app/schemas/auth";
import { ActionError } from "@/utils/dto";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { resolveSignIn } from "./resolvers";
import "./style.module.css";

let errors: ActionError<SignInSchemaT> = {};

export async function SignIn() {
  await unAuthGuard();

  const email = cookies().get("email")?.value;
  if (!email) redirect("/auth");

  const submit = async (data: FormData) => {
    "use server";
    const result = await resolveSignIn(data, email);
    if (result.success) {
      cookies().delete("email");

      const redirectTo = getSearchParam("redirectTo");
      redirect(redirectTo ?? "/");
    } else {
      errors = result.errors;
      revalidatePath(getUrl());
    }
  };

  return (
    <form action={submit}>
      Log in as {email}
      Enter your password
      <input name="password" placeholder="Password" type="password" required />
      {errors.password && <p>{errors.password}</p>}
      {errors.global && <p>{errors.global}</p>}
      <button type="submit">Sign In</button>
    </form>
  );
}
