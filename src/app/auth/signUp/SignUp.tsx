import { unAuthGuard } from "@/app/internal-actions/auth";
import {
  getSearchParam,
  redirectPreserveSearchParams,
  revalidatePage,
} from "@/app/internal-actions/url";
import { variable } from "@/app/internal-actions/variables";
import { SignUpSchemaT } from "@/app/schemas/auth";
import { ActionError } from "@/utils/dto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { resolveSignUp } from "./resolvers";
import "./sign-up.module.css";

const errorsVariable = variable<ActionError<SignUpSchemaT>>("errorsSighUp");

export async function SignUp() {
  await unAuthGuard();

  const email = cookies().get("email")?.value;
  if (!email) redirectPreserveSearchParams("/auth");

  const submit = async (data: FormData) => {
    "use server";

    const result = await resolveSignUp(data, email);
    if (result.success) {
      cookies().delete("email");

      const redirectTo = getSearchParam("redirectTo");
      redirect(redirectTo ?? "/");
    } else {
      errorsVariable.set(result.errors);
      revalidatePage();
    }
  };

  const errors = errorsVariable.get() ?? {};

  return (
    <form action={submit}>
      Register {email}
      Enter your new password
      <input
        name="password"
        placeholder="Password"
        type="password"
        required
        maxLength={254}
      />
      {errors.password && <p>{errors.password}</p>}
      <input
        name="confirmPassword"
        placeholder="Confirm password"
        type="password"
        required
        maxLength={254}
      />
      {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
      {errors.global && <p>{errors.global}</p>}
      <button type="submit">Sign Up</button>
    </form>
  );
}
