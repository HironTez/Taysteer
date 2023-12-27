import { revalidatePath } from "next/cache";
import React from "react";
import { ActionError } from "../../utils/dto";
import { authGuard } from "../internal-actions/auth";
import { getUrl } from "../internal-actions/url";
import { LogInSchemaT } from "../schemas/user";
import { resolveLogIn } from "./resolvers";

let errors: ActionError<LogInSchemaT> = {};

export async function Auth() {
  await authGuard("inverted");

  const submit = async (data: FormData) => {
    "use server";
    const result = await resolveLogIn(data);
    errors = result.errors;
    revalidatePath(getUrl());
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
