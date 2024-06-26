import { hash } from "bcrypt";
import { LogInSchemaT, SignInSchemaT, SignUpSchemaT } from "../schemas/auth";

import { prisma } from "@/db";
import { setAllCookies } from "@/utils/cookies";
import { validateEmail } from "@/utils/email";
import { Status, User } from "@prisma/client";
import bcrypt from "bcrypt";

import { noop } from "@/utils/function";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { actionError, actionResponse } from "../../utils/dto";
import { createToken, verifyTokens } from "./tokens";
import { getPathname, getSearchParam } from "./url";
import { getUserByEmail, getUserById } from "./user";

const createSession = async (userId: string) => {
  const currentTime = new Date().getTime();
  const in60Days = currentTime + 5184000000;
  const in10Minutes = currentTime + 600000;

  try {
    // Create a session
    const newSession = await prisma.session.create({
      data: { userId, expiresAt: new Date(in60Days) },
    });

    // Delete the session after 60 days
    await prisma.$runCommandRaw({
      createIndexes: "Session",
      indexes: [
        {
          key: {
            expiresAt: 1,
          },
          name: "expiresAt_ttl_index",
          expireAfterSeconds: 0,
        },
      ],
    });

    // Generate tokens
    const newAccessToken = await createToken(
      { sub: newSession.userId },
      in10Minutes,
    );
    const newRefreshToken = await createToken({ jti: newSession.id }, in60Days);

    // Prepare cookies with tokens
    const responseCookies: ResponseCookie[] = [
      {
        name: "accessToken",
        value: newAccessToken,
        httpOnly: true,
        expires: in10Minutes,
      },
      {
        name: "refreshToken",
        value: newRefreshToken,
        httpOnly: true,
        expires: in60Days,
      },
    ];

    return responseCookies;
  } catch {
    return [];
  }
};

export const renewSession = async () => {
  "use server";
  const { decodedAccessToken, decodedRefreshToken } = await verifyTokens();
  if (decodedAccessToken || !decodedRefreshToken) return [];

  // Verify session
  const sessionId = decodedRefreshToken.jti;

  const session = await prisma.session
    .findUnique({ where: { id: sessionId } })
    .catch(noop);
  if (!session) return [];

  // Renew session
  await prisma.session.delete({ where: { id: sessionId } }).catch(noop);
  return await createSession(session.userId);
};

export const deleteSessionCookies = () => {
  cookies().delete("accessToken");
  cookies().delete("refreshToken");
};

const deleteSession = async () => {
  const { decodedAccessToken, decodedRefreshToken } = await verifyTokens();
  if (!decodedAccessToken || !decodedRefreshToken) return false;

  await prisma.session
    .delete({ where: { id: decodedRefreshToken.jti } })
    .catch(noop);

  deleteSessionCookies();

  return true;
};

const checkUser = (user: User | null | undefined): user is User =>
  user?.status === Status.ACTIVE;

export const checkPassword = async (user: User, password: string) =>
  await bcrypt.compare(password, user.passwordHash);

export const logIn = async (email: string) => {
  const emailValid = validateEmail(email);
  if (!emailValid) {
    return actionError<LogInSchemaT>("Invalid email", "email");
  }

  const user = await getUserByEmail(email);

  if (user) {
    if (user.status === Status.BANNED) {
      return actionError<LogInSchemaT>("User is banned", "email");
    }

    return actionResponse({ nextStep: "signIn", email });
  } else {
    return actionResponse({ nextStep: "signUp", email });
  }
};

export const signIn = async (email: string, password: string) => {
  const user = email ? await getUserByEmail(email) : null;

  // Exit if email is not provided or if user doesn't exist or is banned
  if (!email || !checkUser(user)) {
    return actionError<SignInSchemaT>("Could not sign in");
  }

  if (!(await checkPassword(user, password))) {
    return actionError<SignInSchemaT>("Password is incorrect", "password");
  }

  const newCookies = await createSession(user.id);
  if (!newCookies.length) {
    return actionError<SignInSchemaT>("Could not create a session");
  }
  setAllCookies(newCookies);

  return actionResponse();
};

export const signUp = async (email: string, password: string) => {
  const user = email && (await getUserByEmail(email));
  const emailValid = email && validateEmail(email);

  // Exit if email is not valid or already used
  if (!email || !emailValid || user) {
    return actionError<SignUpSchemaT>("Could not sign up");
  }

  // Hash the password
  const passwordHash = await hash(password, 10);

  // Create the user
  const newUser = await prisma.user
    .create({
      data: {
        email,
        passwordHash,
      },
    })
    .catch(noop);

  if (!newUser) {
    return actionError<SignUpSchemaT>("Could not create user");
  }

  const newCookies = await createSession(newUser.id);
  if (!newCookies.length) {
    return actionError<SignUpSchemaT>(
      "User created but failed to create a session. Try to log into your new account again",
    );
  }
  setAllCookies(newCookies);

  return actionResponse();
};

export const logOut = async () => {
  const sessionDeleted = await deleteSession();

  if (sessionDeleted) redirect("/");
  return false;
};

export const getSessionUser = async () => {
  const { decodedAccessToken } = await verifyTokens();
  if (!decodedAccessToken) return null;
  const user = await getUserById(decodedAccessToken.sub);
  if (user?.status === Status.BANNED) return null;
  return user ?? null;
};

export const redirectToAuth: () => never = () => {
  const pathname = getPathname();
  redirect(`/auth?redirectTo=${pathname}`);
};

export const authGuard = async () => {
  const user = await getSessionUser();
  if (!user) {
    redirectToAuth();
  }

  return user;
};

export const unAuthGuard = async () => {
  const user = await getSessionUser();
  if (user) {
    const redirectTo = getSearchParam("redirectTo");
    redirect(redirectTo ?? "/");
  }
};
