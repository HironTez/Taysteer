import { signIn } from "next-auth/react";

export const logIn = (login: string, password: string) =>
  signIn("credentials", {
    redirect: false,
    login,
    password,
  });
