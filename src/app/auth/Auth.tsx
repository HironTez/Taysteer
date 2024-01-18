import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ActionError } from "../../utils/dto";
import { unAuthGuard } from "../internal-actions/auth";
import { getSearchParam, revalidatePage } from "../internal-actions/url";
import { variable } from "../internal-actions/variables";
import { LogInSchemaT } from "../schemas/auth";
import "./auth.module.css";
import { resolveLogIn } from "./resolvers";

const errorsVariable = variable<ActionError<LogInSchemaT>>("errors");

export async function Auth() {
  await unAuthGuard();

  const submit = async (data: FormData) => {
    "use server";

    const result = await resolveLogIn(data);
    if (result.success) {
      cookies().set("email", result.data.email, {
        httpOnly: true,
      });

      const redirectTo = getSearchParam("redirectTo");
      redirect(
        `/auth/${result.data.nextStep}${
          redirectTo ? `?redirectTo=${redirectTo}` : ""
        }`,
      );
    } else {
      errorsVariable.set(result.errors);
      revalidatePage();
    }
  };

  const errors = errorsVariable.get() ?? {};

  return (
    <form action={submit}>
      Welcome! Enter your email to sign up or login
      <input
        name="email"
        placeholder="Email"
        type="email"
        required
        maxLength={254}
      />
      {errors.email && <p>{errors.email}</p>}
      <button type="submit">Continue</button>
    </form>
  );
}
