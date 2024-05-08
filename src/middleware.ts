import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest, NextResponse } from "next/server";

const setUrlHeaders = (requestHeaders: Headers, request: NextRequest) => {
  requestHeaders.set("x-url", request.url);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  requestHeaders.set("x-search", request.nextUrl.search);
};

const clearCookieVariables = (request: NextRequest, response: NextResponse) => {
  const cookies = request.cookies.getAll();
  for (const cookie of cookies) {
    if (cookie.name.startsWith("_variable_")) {
      response.cookies.delete(cookie.name);
    }
  }
};

const renewSession = async (request: NextRequest) => {
  const responseRenewSession = await fetch(
    new URL("/api/renew-session", request.url),
    {
      headers: request.headers,
    },
  );

  try {
    return (await responseRenewSession.json()) as ResponseCookie[];
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
    const cookies = await renewSession(request);

    setCookies(request, cookies);
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
    setCookies(response, cookies);

    clearCookieVariables(request, response);

    return response;
  }

  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|images?|__nextjs_original-stack-frame).*)",
  ],
};
