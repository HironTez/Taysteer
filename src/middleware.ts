import { parseSetCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest, NextResponse } from "next/server";
import { splitCookiesString } from "set-cookie-parser";

const setUrlHeaders = (request: NextRequest, headers: Headers) => {
  headers.set("x-url", request.url);
  headers.set("x-pathname", request.nextUrl.pathname);
  headers.set("x-search", request.nextUrl.search);
};

const renewSession = async (request: NextRequest, response: NextResponse) => {
  const responseRenewSession = await fetch(
    new URL("/renew-session", request.url),
    {
      headers: response.headers,
    },
  );

  const setCookieHeader = responseRenewSession.headers.get("Set-Cookie");
  const cookieStrings = setCookieHeader
    ? splitCookiesString(setCookieHeader)
    : [];

  for (const cookieString of cookieStrings) {
    const parsedCookie = parseSetCookie(cookieString);
    if (parsedCookie) {
      response.cookies.set(parsedCookie.name, parsedCookie.value, parsedCookie);
    }
  }
};

const clearCookieVariables = (request: NextRequest, response: NextResponse) => {
  const cookies = request.cookies.getAll();
  for (const cookie of cookies) {
    if (cookie.name.startsWith("_variable_")) {
      response.cookies.delete(cookie.name);
    }
  }
};

export async function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);

  setUrlHeaders(request, headers);

  const response = NextResponse.next({
    request: {
      headers,
    },
  });

  if (request.method === "GET") {
    await renewSession(request, response);

    clearCookieVariables(request, response);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|images?|__nextjs_original-stack-frame).*)",
  ],
};
