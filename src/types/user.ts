import { Prisma } from "@prisma/client";

export type UserWithImage = Prisma.UserGetPayload<{
  include: { image: { select: { id: true } } };
}>;
