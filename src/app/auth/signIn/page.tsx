import { getUrl } from "@/app/internal-actions/url";
import { SignInSchemaT } from "@/app/schemas/user";
import { authGuard } from "@/utils/authGuard";
import { ActionError } from "@/utils/dto";
import { revalidatePath } from "next/cache";
import React from "react";
import { resolveSignIn } from "./resolvers";
import "./style.css";

let errors: ActionError<SignInSchemaT> = {};

const SignIn = async () => {
  await authGuard("inverted");

  const submit = async (data: FormData) => {
    "use server";
    const result = await resolveSignIn(data);
    errors = result.errors;
    revalidatePath(getUrl());
  };

  return (
    <form action={submit}>
      Enter your new password
      <input name="password" placeholder="Password" type="password" required />
      {errors.password && <p>{errors.password}</p>}
      {errors.global && <p>{errors.global}</p>}
      <button type="submit">Sign In</button>
    </form>
  );
};

export default SignIn;
