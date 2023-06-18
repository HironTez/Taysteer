import { HttpError, HttpResponse } from "../../tools";

import { StatusCodes } from "http-status-codes";
import { excludePassword } from "../tools";
import { getServerSession } from "next-auth";
import { prisma } from "@/db";

export async function GET(
  _request: Request,
  { params: { userId } }: { params: { userId: string } }
) {
  // Auth guard
  const auth = (await getServerSession())?.user;
  if (!auth) return HttpError(StatusCodes.UNAUTHORIZED);

  // Get data from database
  const user = await prisma.user.findFirst({
    where:
      userId !== "me"
        ? { id: userId }
        : auth.email
        ? { email: auth.email }
        : {},
  });

  const userWithoutPassword = user ? excludePassword(user) : null;

  return HttpResponse({
    user: userWithoutPassword,
  });
}
