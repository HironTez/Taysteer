"use client";

import React from "react";
import { createUserSchema } from "../schemas/user";
import { errorHandler } from "../../utils/react.hook.form";
import { signIn } from "next-auth/react";
import { submitRegister } from "./actions";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

interface IAuthClientProps {}

const AuthClient = (props: IAuthClientProps) => {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserSchema),
  });

  const router = useRouter();

  return (
    <form
      onSubmit={handleSubmit(async (d) => {
        const result = await submitRegister(d);
        errorHandler(result, setError);
        if (result.success)
          signIn("credentials", {login: d.email, password: d.password}).then(() => router.push("/"));
      })}
    >
      <input type="email" {...register("email", { required: true })} />
      {errors.email?.message && <p>{errors.email?.message.toString()}</p>}
      <input type="password" {...register("password", { required: true })} />
      {errors.age?.message && <p>{errors.age?.message.toString()}</p>}
      <button type="submit">Register</button>
    </form>
  );
};

export default AuthClient;
