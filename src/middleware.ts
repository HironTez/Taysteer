import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-url", request.url);
  headers.set("x-pathname", request.nextUrl.pathname);
  headers.set("x-search", request.nextUrl.search);

  return NextResponse.next({
    request: {
      headers,
    },
  });
}
