import { Prisma } from "@prisma/client";

type IncludeImage = {
  include: { image: { select: { id: true } } };
};

type IncludeUser = {
  include: { user: IncludeImage };
};

export type UserWithImage = Prisma.UserGetPayload<IncludeImage>;

export type CommentWithUser = Prisma.CommentGetPayload<IncludeUser>;

export type RecipeWithUser = Prisma.RecipeGetPayload<IncludeUser>;
