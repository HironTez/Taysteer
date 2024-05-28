import { cookies } from "next/headers";
import { ActionError } from "../../utils/dto";
import { unAuthGuard } from "../internal-actions/auth";
import {
  redirectPreserveSearchParams,
  revalidatePage,
} from "../internal-actions/url";
import { variable } from "../internal-actions/variables";
import { LogInSchemaT } from "../schemas/auth";
import "./auth.module.css";
import { resolveLogIn } from "./resolvers";

const errorsVariable = variable<ActionError<LogInSchemaT>>("errorsLogIn");

export async function Auth() {
  await unAuthGuard();

  const submit = async (data: FormData) => {
    "use server";

    const result = await resolveLogIn(data);
    if (result.success) {
      cookies().set("email", result.data.email, {
        httpOnly: true,
      });
      errorsVariable.delete();

      redirectPreserveSearchParams(`/auth/${result.data.nextStep}`);
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
      {errors.global && <p>{errors.global}</p>}
      <button type="submit">Continue</button>
    </form>
  );
}
