import { hash } from "bcrypt";
import { LogInSchemaT, SignInSchemaT, SignUpSchemaT } from "../schemas/auth";

import { prisma } from "@/db";
import { validateEmail } from "@/utils/email";
import { Status } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { actionError, actionResponse } from "../../utils/dto";
import { getPathname, getSearchParam } from "./url";
import { getUserBy } from "./user";

type JWT = {
  iat: number;
  exp: number;
};

type AccessJWTInput = {
  sub: string;
};

type RefreshJWTInput = {
  jti: string;
};

type AccessJWT = AccessJWTInput & JWT;

type RefreshJWT = RefreshJWTInput & JWT;

const SECRET = process.env.AUTH_SECRET!;

const createToken = <T extends AccessJWTInput | RefreshJWTInput>(
  payload: T,
  options?: SignOptions,
) => jwt.sign(payload, SECRET, options);

const verifyToken = <R extends JWT>(
  token: string | undefined,
): R | undefined => {
  try {
    let decodedToken = token && jwt.verify(token, SECRET);
    if (typeof decodedToken === "string") decodedToken = undefined;
    return decodedToken as R | undefined;
  } catch {
    return undefined;
  }
};

const verifyTokens = () => {
  // Verify access token
  const accessToken = cookies().get("accessToken")?.value;
  const decodedAccessToken = verifyToken<AccessJWT>(accessToken);

  // Verify refresh token
  const refreshToken = cookies().get("refreshToken")?.value;
  const decodedRefreshToken = verifyToken<RefreshJWT>(refreshToken);

  return { decodedAccessToken, decodedRefreshToken };
};

const createSession = async (userId: string) => {
  // Create a session
  const newSession = await prisma.session.create({
    data: { userId },
  });

  // Generate tokens
  const newAccessToken = createToken(
    { sub: newSession.userId },
    { expiresIn: "10m" },
  );
  const newRefreshToken = createToken(
    { jti: newSession.id },
    { expiresIn: "60d" },
  );
  const currentTime = new Date().getTime();
  const in60Days = currentTime + 5184000000;
  const in10Minutes = currentTime + 600000;

  // Set tokens to cookies
  cookies().set("accessToken", `${newAccessToken}`, {
    httpOnly: true,
    expires: in10Minutes,
  });
  cookies().set("refreshToken", `${newRefreshToken}`, {
    httpOnly: true,
    expires: in60Days,
  });
};

export const renewSession = async () => {
  const { decodedAccessToken, decodedRefreshToken } = verifyTokens();
  if (decodedAccessToken || !decodedRefreshToken) return;
  // Verify session
  const sessionId = decodedRefreshToken.jti;
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session) return;

  // Renew session
  await prisma.session.delete({ where: { id: sessionId } });
  await createSession(session.userId);
};

const deleteSession = async () => {
  const { decodedAccessToken, decodedRefreshToken } = verifyTokens();
  if (!decodedAccessToken || !decodedRefreshToken) return false;

  await prisma.session
    .delete({ where: { id: decodedRefreshToken.jti } })
    .catch(null);

  cookies().delete("accessToken");
  cookies().delete("refreshToken");

  return true;
};

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

  await createSession(user.id);

  return actionResponse();
};

export const signUp = async (email: string, password: string) => {
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

  // Hash the password
  const passwordHash = await hash(password, 10);

  // Create a unique username
  const username = `user${Date.now()}`; // FIXME: collision

  // Create the user
  const newUser = await prisma.user.create({
    data: {
      email,
      passwordHash,
      username,
    },
  });

  await createSession(newUser.id);

  return actionResponse();
};

export const logOut = async () => {
  const sessionDeleted = await deleteSession();

  if (sessionDeleted) redirect("/");
  return false;
};

export const getSessionUser = async () => {
  const { decodedAccessToken, decodedRefreshToken } = verifyTokens();
  if (!decodedAccessToken || !decodedRefreshToken) return null;

  const user = await getUserBy({ userId: decodedAccessToken.sub });
  return user;
};

const authGuard = async () => {
  const user = await getSessionUser();
  if (!user) {
    const pathname = getPathname();
    redirect(`/auth?redirectTo=${pathname}`);
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
