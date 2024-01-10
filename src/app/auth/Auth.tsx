import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ActionError } from "../../utils/dto";
import { unAuthGuard } from "../internal-actions/auth";
import { getSearchParam, getUrl } from "../internal-actions/url";
import { LogInSchemaT } from "../schemas/auth";
import { resolveLogIn } from "./resolvers";

let errors: ActionError<LogInSchemaT> = {};

export async function Auth() {
  await unAuthGuard();

  const submit = async (data: FormData) => {
    "use server";
    const result = await resolveLogIn(data);
    if (result.success) {
      const redirectTo = getSearchParam("redirectTo");
      redirect(
        `/auth/${result.data.nextStep}?email=${result.data.email}${
          redirectTo ? `&redirectTo=${redirectTo}` : ""
        }`,
      ); // TODO: hide email from url
    } else {
      errors = result.errors;
      revalidatePath(getUrl());
    }
  };

  return (
    <form action={submit}>
      Welcome! Enter your email to sign up or login
      <input name="email" placeholder="Email" type="email" required />
      {errors.email && <p>{errors.email}</p>}
      <button type="submit">Continue</button>
    </form>
  );
}
