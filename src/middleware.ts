import { parseSetCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest, NextResponse } from "next/server";
import { splitCookiesString } from "set-cookie-parser";

export async function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);

  headers.set("x-url", request.url);
  headers.set("x-pathname", request.nextUrl.pathname);
  headers.set("x-search", request.nextUrl.search);

  const response = NextResponse.next({
    request: {
      headers,
    },
  });

  if (request.method === "GET") {
    const responseRenewSession = await fetch(
      new URL("/renew-session", request.url),
      {
        headers,
      },
    );

    const setCookieHeader = responseRenewSession.headers.get("Set-Cookie");
    const cookieStrings = setCookieHeader
      ? splitCookiesString(setCookieHeader)
      : [];
    for (const cookieString of cookieStrings) {
      const parsed = parseSetCookie(cookieString);
      if (parsed) response.cookies.set(parsed.name, parsed.value, parsed);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|images?|__nextjs_original-stack-frame).*)",
  ],
};
