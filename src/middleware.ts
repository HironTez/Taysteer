import {
  RequestCookie,
  ResponseCookie,
  parseCookie,
  parseSetCookie,
  stringifyCookie,
} from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest, NextResponse } from "next/server";
import { splitCookiesString } from "set-cookie-parser";

const responseToRequestCookies = (cookies: ResponseCookie[]): RequestCookie[] =>
  cookies.map((cookie) => ({ name: cookie.name, value: cookie.value }));

const parseCookies = (headers: Headers) => {
  const cookieHeader = headers.get("Cookie");
  const cookiesMap = cookieHeader ? parseCookie(cookieHeader) : [];
  const cookies: RequestCookie[] = Array.from(cookiesMap, ([name, value]) => ({
    name,
    value,
  }));

  const setCookieHeader = headers.get("Set-Cookie");
  const setCookieStrings = setCookieHeader
    ? splitCookiesString(setCookieHeader)
    : [];
  const setCookies = setCookieStrings
    .map((setCookieString) => parseSetCookie(setCookieString))
    .filter((cookie): cookie is ResponseCookie => !!cookie);

  return { cookies, setCookies };
};

const setUrlHeaders = (request: NextRequest, requestHeaders: Headers) => {
  requestHeaders.set("x-url", request.url);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  requestHeaders.set("x-search", request.nextUrl.search);
};

const renewSession = async (request: NextRequest, requestHeaders: Headers) => {
  const responseRenewSession = await fetch(
    new URL("/renew-session", request.url),
    {
      headers: requestHeaders,
    },
  );

  const { setCookies } = parseCookies(responseRenewSession.headers);

  return setCookies;
};

const clearCookieVariables = (request: NextRequest, response: NextResponse) => {
  const cookies = request.cookies.getAll();
  for (const cookie of cookies) {
    if (cookie.name.startsWith("_variable_")) {
      response.cookies.delete(cookie.name);
    }
  }
};

const setRequestCookies = (
  headers: Headers,
  setCookies: (RequestCookie | ResponseCookie)[],
) => {
  const { cookies: oldCookies } = parseCookies(headers);
  const newCookies = responseToRequestCookies(setCookies);
  const cookies = [...oldCookies, ...newCookies];
  const stringifiedCookies = cookies.map((cookie) => stringifyCookie(cookie));
  const cookieHeader = stringifiedCookies.join("; ");
  headers.set("Cookie", cookieHeader);
};

const setResponseHeaders = (headers: Headers, setCookies: ResponseCookie[]) => {
  const stringifiedCookies = setCookies.map((cookie) =>
    stringifyCookie(cookie),
  );
  const cookieHeader = stringifiedCookies.join(", ");
  headers.set("Set-Cookie", cookieHeader);
};

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  setUrlHeaders(request, requestHeaders);

  if (request.method === "GET") {
    const cookies = await renewSession(request, requestHeaders);

    setRequestCookies(requestHeaders, cookies);
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    setResponseHeaders(response.headers, cookies);

    clearCookieVariables(request, response);

    return response;
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|images?|__nextjs_original-stack-frame).*)",
  ],
};
