import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

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

export const createToken = <T extends AccessJWTInput | RefreshJWTInput>(
  payload: T,
  expirationTime: number,
) =>
  new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expirationTime)
    .sign(new TextEncoder().encode(SECRET));

const verifyToken = async <R extends JWT>(
  token: string | undefined,
): Promise<R | undefined> => {
  if (!token) return;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(SECRET),
    );
    return payload as R;
  } catch {
    return;
  }
};

export const verifyTokens = async () => {
  // Verify access token
  const accessToken = cookies().get("accessToken")?.value;
  const decodedAccessToken = await verifyToken<AccessJWT>(accessToken);

  // Verify refresh token
  const refreshToken = cookies().get("refreshToken")?.value;
  const decodedRefreshToken = await verifyToken<RefreshJWT>(refreshToken);

  return { decodedAccessToken, decodedRefreshToken };
};
