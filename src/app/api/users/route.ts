import { GetUsersDto } from "./users.dto";
import { NextResponse } from "next/server";
import { excludePassword } from "./tools";
import { prisma } from "@/db";
import { HttpError, HttpResponse, isAuthenticated } from "../tools";
import { StatusCodes } from "http-status-codes";

/**
 * Get user list
 * @query page — Index of page to return. Starts with 0. Default 0.
 * @query take — The number of users to return. Default 10.
 */
export async function GET(
  request: Request
): Promise<NextResponse<GetUsersDto>> {
  // Auth guard
  if (!(await isAuthenticated())) return HttpError(StatusCodes.UNAUTHORIZED);

  // Get query parameters
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) || 0;
  const take = Number(searchParams.get("take")) || 10;

  // Get data from database
  const users = await prisma.user.findMany({ take: take, skip: page * take });
  const usersWithoutPasswords = users.map(excludePassword);
  const numberOfUsers = await prisma.user.count();

  const hasMore = (page + 1) * take < numberOfUsers;

  return HttpResponse({
    users: usersWithoutPasswords,
    pagination: { hasMore },
  });
}
