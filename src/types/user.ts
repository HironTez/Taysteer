import { Prisma } from "@prisma/client";

export type UserWithImage = Omit<
  Prisma.UserGetPayload<{
    include: { image: { select: { id: true } } };
  }>,
  "passwordHash"
>;
