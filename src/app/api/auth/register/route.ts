import { HttpError, HttpResponse } from "./../../tools";

import { StatusCodes } from "http-status-codes";
import { excludePassword } from "../../users/tools";
import { hash } from "bcrypt";
import { prisma } from "@/db";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Check if email isn't registered
  const exists = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (exists) return HttpError(StatusCodes.CONFLICT);

  // Hash the password
  const passwordHash = await hash(password, 10);

  // Create an unique username
  const username = `user${Date.now()}`;

  // Create the user
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      username,
    },
  });
  return HttpResponse(excludePassword(user));
}
