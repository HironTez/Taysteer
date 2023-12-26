import { getUrl } from "@/app/internal-actions/url";
import { SignUpSchemaT } from "@/app/schemas/user";
import { authGuard } from "@/utils/authGuard";
import { ActionError } from "@/utils/dto";
import { revalidatePath } from "next/cache";
import React from "react";
import { resolveSignUp } from "./resolvers";
import "./style.css";

let errors: ActionError<SignUpSchemaT> = {};

const SignUp = async () => {
  await authGuard("inverted");

  const submit = async (data: FormData) => {
    "use server";
    const result = await resolveSignUp(data);
    errors = result.errors;
    revalidatePath(getUrl());
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
};

export default SignUp;
