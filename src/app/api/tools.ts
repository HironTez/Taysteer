import { ReasonPhrases, StatusCodes, getReasonPhrase } from "http-status-codes";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export const HttpResponse = <T>(data: T) =>
  NextResponse.json({ data, ok: true, error: undefined });

export const HttpError = <Status extends StatusCodes>(
  statusCode: Status
) =>
  NextResponse.json(
    {
      error: {
        message: getReasonPhrase(statusCode) as ReasonPhrases,
        status: statusCode,
      },
      ok: false,
      data: undefined,
    },
    { status: statusCode }
  );

export const isAuthenticated = async () => !!(await getServerSession())?.user;
