import { prisma } from "@/db";
import { actionError, actionResponse } from "@/utils/dto";
import { Recipe, User } from "@prisma/client";

export const getComments = (recipe: Recipe, page: number) => {
  return prisma.comment.findMany({
    where: { recipeId: recipe.id },
    take: page * 10,
    orderBy: { updatedAt: "desc" },
    include: { user: { include: { image: { select: { id: true } } } } },
  });
};

export const getCommentsCount = async (recipe: Recipe) => {
  const result = await prisma.comment.aggregate({
    where: { recipeId: recipe.id },
    _count: true,
  });

  return result._count;
};

export const createComment = async (
  text: string,
  recipe: Recipe,
  user: User,
) => {
  try {
    await prisma.comment.create({
      data: {
        text,
        recipe: { connect: { id: recipe.id } },
        user: { connect: { id: user.id } },
      },
      include: { user: { include: { image: { select: { id: true } } } } },
    });
    return actionResponse();
  } catch {
    return actionError("Could not create comment");
  }
};
