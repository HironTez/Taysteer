import { authGuard, getSessionUser } from "@/app/internal-actions/auth";
import { revalidatePage } from "@/app/internal-actions/url";
import { variable } from "@/app/internal-actions/variables";
import { ChangePasswordSchemaT } from "@/app/schemas/user";
import { ActionError } from "@/utils/dto";
import { redirect } from "next/navigation";
import { resolveChangePassword } from "./resolvers";

const errorsVariable = variable<ActionError<ChangePasswordSchemaT>>(
  "errorsChangePassword",
);

export async function ChangePassword() {
  await authGuard();

  const errors = errorsVariable.get() ?? {};

  const submit = async (data: FormData) => {
    "use server";

    const sessionUser = await getSessionUser();
    if (sessionUser) {
      const result = await resolveChangePassword(data, sessionUser);
      if (result.success) {
        errorsVariable.delete();
        redirect("/profile");
      } else {
        errorsVariable.set(result.errors);
      }
      revalidatePage();
    } else {
      errorsVariable.set({ global: "forbidden" });
    }

    revalidatePage();
  };

  return (
    <form action={submit}>
      Change password from your account
      <input
        name="oldPassword"
        placeholder="Old password"
        type="password"
        required
        maxLength={254}
      />
      {errors.oldPassword && <p>{errors.oldPassword}</p>}
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
      <input type="submit" />
      {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
      {errors.global && <p>{errors.global}</p>}
    </form>
  );
}
