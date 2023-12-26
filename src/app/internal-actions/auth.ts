import { hash } from "bcrypt";
import { LogInSchemaT, SignInSchemaT, SignUpSchemaT } from "../schemas/user";

import { prisma } from "@/db";
import { validateEmail } from "@/utils/email";
import { Status } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { actionError } from "../../utils/dto";
import { getPathname, getSearchParam } from "./url";

const SECRET = process.env.AUTH_SECRET!;

export const logIn = async (email: string) => {
  const emailValid = validateEmail(email);
  if (!emailValid) {
    return actionError<LogInSchemaT>("Invalid email", "email");
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  const redirectTo = getSearchParam("redirectTo");

  if (user) {
    if (user.status === Status.BANNED) {
      return actionError<LogInSchemaT>("User is banned", "email");
    }

    redirect(
      `/auth/signIn?email=${email}${
        redirectTo ? `&redirectTo=${redirectTo}` : ""
      }`,
    ); // TODO: hide email from url
  } else {
    redirect(
      `/auth/signUp?email=${email}${
        redirectTo ? `&redirectTo=${redirectTo}` : ""
      }`,
    );
  }
};

export const signIn = async (password: string) => {
  const email = getSearchParam("email");

  const user =
    email &&
    (await prisma.user.findUnique({
      where: {
        email,
      },
    }));

  // Exit email is not provided or if user doesn't exist or is banned
  if (!email || !user || user.status === Status.BANNED) {
    return actionError<SignInSchemaT>("Couldn't sign in");
  }

  if (!(await bcrypt.compare(password, user.passwordHash))) {
    return actionError<SignInSchemaT>("Password is incorrect", "password");
  }

  // Generate token
  const token = jwt.sign({ userId: user.id }, SECRET);

  // Set token
  cookies().set("authToken", `Bearer ${token}`);

  const redirectTo = getSearchParam("redirectTo");
  redirect(redirectTo ?? "/");
};

export const signUp = async (password: string, confirmPassword: string) => {
  const email = getSearchParam("email");

  const user =
    email &&
    (await prisma.user.findUnique({
      where: {
        email,
      },
    }));

  const emailValid = email && validateEmail(email);

  // Exit if email is not valid or already used
  if (!email || user || !emailValid) {
    return actionError<SignUpSchemaT>("Couldn't sign up");
  }

  if (password !== confirmPassword) {
    return actionError<SignUpSchemaT>(
      "Passwords don't match",
      "confirmPassword",
    );
  }

  // Hash the password
  const passwordHash = await hash(password, 10);

  // Create a unique username
  const username = `user${Date.now()}`;

  // Create the user
  const newUser = await prisma.user.create({
    data: {
      email,
      passwordHash,
      username,
    },
  });

  // Generate token
  const token = jwt.sign({ userId: newUser.id }, SECRET);

  // Set token
  cookies().set("authToken", `Bearer ${token}`);

  const redirectTo = getSearchParam("redirectTo");
  redirect(redirectTo ?? "/");
};

export const logOut = () => {
  cookies().delete("authToken");

  redirect("/");
};

const getSession = async () => {
  const token = cookies().get("authToken")?.value.replace("Bearer ", "");
  if (!token) return null;

  const decodedToken = jwt.verify(token, SECRET);
  if (typeof decodedToken === "string") return null;

  const userId = decodedToken["userId"];
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user ? { user } : null;
};

export const authGuard = async (inverted?: "inverted") => {
  const pathname = getPathname();
  const redirectTo = getSearchParam("redirectTo");

  const session = await getSession();
  if (!inverted && !session?.user) {
    redirect(`/auth?redirectTo=${pathname}`);
  } else if (inverted && session?.user) {
    redirect(redirectTo ?? "/");
  }

  return session;
};
