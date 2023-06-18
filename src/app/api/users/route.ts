import { HttpError, HttpResponse, isAuthenticated } from "../tools";

import { StatusCodes } from "http-status-codes";
import { excludePassword } from "./tools";
import { prisma } from "@/db";

export async function GET(request: Request) {
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
