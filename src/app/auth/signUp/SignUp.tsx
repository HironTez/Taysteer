import { authGuard } from "@/app/internal-actions/auth";
import { getSearchParam, getUrl } from "@/app/internal-actions/url";
import { SignUpSchemaT } from "@/app/schemas/auth";
import { ActionError } from "@/utils/dto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import React from "react";
import { resolveSignUp } from "./resolvers";
import "./style.module.css";

let errors: ActionError<SignUpSchemaT> = {};

export async function SignUp() {
  await authGuard({ inverted: true });

  const submit = async (data: FormData) => {
    "use server";
    const result = await resolveSignUp(data);
    if (result.success) {
      result.data;
      const redirectTo = getSearchParam("redirectTo");
      redirect(redirectTo ?? "/");
    } else {
      errors = result.errors;
      revalidatePath(getUrl());
    }
  };

  return (
    <form action={submit}>
      Enter your new password
      <input name="password" placeholder="Password" type="password" required />
      {errors.password && <p>{errors.password}</p>}
      <input
        name="confirmPassword"
        placeholder="Confirm password"
        type="password"
        required
      />
      {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
      {errors.global && <p>{errors.global}</p>}
      <button type="submit">Sign Up</button>
    </form>
  );
}
