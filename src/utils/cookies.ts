import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export const setAllCookies = (cookieList: ResponseCookie[]) =>
  cookieList.forEach((cookie) => cookies().set(cookie));
