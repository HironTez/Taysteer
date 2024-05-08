import { hash } from "bcrypt";
import { LogInSchemaT, SignInSchemaT, SignUpSchemaT } from "../schemas/auth";

import { prisma } from "@/db";
import { setAllCookies } from "@/utils/cookies";
import { validateEmail } from "@/utils/email";
import { Status } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { actionError, actionResponse } from "../../utils/dto";
import { getPathname, getSearchParam } from "./url";
import { getUserById } from "./user";

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
  const currentTime = new Date().getTime();
  const in60Days = new Date(currentTime + 5184000000);
  const in10Minutes = new Date(currentTime + 600000);

  // Create a session
  const newSession = await prisma.session.create({
    data: { userId, expiresAt: in60Days },
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
  const newAccessToken = createToken(
    { sub: newSession.userId },
    { expiresIn: "10m" },
  );
  const newRefreshToken = createToken(
    { jti: newSession.id },
    { expiresIn: "60d" },
  );

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
};

export const renewSession = async () => {
  "use server";
  const { decodedAccessToken, decodedRefreshToken } = verifyTokens();
  if (decodedAccessToken || !decodedRefreshToken) return [];

  // Verify session
  const sessionId = decodedRefreshToken.jti;
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session) return [];

  // Renew session
  await prisma.session.delete({ where: { id: sessionId } });
  return await createSession(session.userId);
};

export const deleteSessionCookies = () => {
  cookies().delete("accessToken");
  cookies().delete("refreshToken");
};

const deleteSession = async () => {
  const { decodedAccessToken, decodedRefreshToken } = verifyTokens();
  if (!decodedAccessToken || !decodedRefreshToken) return false;

  await prisma.session
    .delete({ where: { id: decodedRefreshToken.jti } })
    .catch(null);

  deleteSessionCookies();

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

  const newCookies = await createSession(user.id);
  setAllCookies(newCookies);

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
  if (!email || !emailValid || user) {
    return actionError<SignUpSchemaT>("Couldn't sign up");
  }

  // Hash the password
  const passwordHash = await hash(password, 10);

  // Create the user
  const newUser = await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });

  const newCookies = await createSession(newUser.id);
  setAllCookies(newCookies);

  return actionResponse();
};

export const logOut = async () => {
  const sessionDeleted = await deleteSession();

  if (sessionDeleted) redirect("/");
  return false;
};

export const getSessionUser = async () => {
  const { decodedAccessToken } = verifyTokens();
  if (!decodedAccessToken) return null;
  const user = await getUserById(decodedAccessToken.sub);
  return user;
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
