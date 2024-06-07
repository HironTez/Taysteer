import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest, NextResponse } from "next/server";
import { verifyTokens } from "./app/internal-actions/tokens";
import { newUrl } from "./app/internal-actions/url";

const setUrlHeaders = (requestHeaders: Headers, request: NextRequest) => {
  requestHeaders.set("x-url", request.url);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  requestHeaders.set("x-search", request.nextUrl.search);
};

const clearCookieVariables = (request: NextRequest) => {
  const cookies = request.cookies.getAll();
  for (const cookie of cookies) {
    if (cookie.name.startsWith("_variable_")) {
      request.cookies.delete(cookie.name);
    }
  }
};

const renewSession = async (request: NextRequest) => {
  try {
    const cookies = await fetch(newUrl("/api/renew-session", request.url), {
      headers: request.headers,
      method: "POST",
      body: process.env.AUTH_SECRET!,
    }).then((result) => result.json());

    return cookies as ResponseCookie[];
  } catch {
    return [];
  }
};

const setCookies = (
  httpAction: NextRequest | NextResponse,
  cookies: ResponseCookie[],
) => {
  cookies.forEach((cookie) => httpAction.cookies.set(cookie));
};

export async function middleware(request: NextRequest) {
  setUrlHeaders(request.headers, request);

  if (request.method === "GET") {
    clearCookieVariables(request);

    const { decodedAccessToken, decodedRefreshToken } = await verifyTokens();
    if (!decodedAccessToken && decodedRefreshToken) {
      const cookies = await renewSession(request);

      setCookies(request, cookies);
      const response = NextResponse.next({
        request: {
          headers: request.headers,
        },
      });
      setCookies(response, cookies);

      return response;
    }
  }

  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static(?!.+\\.module\\.css)|_next/image|favicon\\.ico|robots\\.txt|images?|__nextjs_original-stack-frame).*)",
  ],
};
