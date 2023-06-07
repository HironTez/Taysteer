import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { HttpErrorT } from "./dto";

export const HttpResponse = <T>(data: T) => NextResponse.json({ data });

export const HttpError = (
  statusCode: StatusCodes
): NextResponse<{ error: HttpErrorT }> =>
  NextResponse.json(
    {
      error: { message: getReasonPhrase(statusCode), status: statusCode },
    },
    { status: statusCode }
  );

export const isAuthenticated = async () => !!(await getServerSession())?.user;
