import { prisma } from "@/db";
import { Recipe } from "@prisma/client";

export const getComments = (recipe: Recipe, page: number) => {
  return prisma.comment.findMany({
    where: { recipeId: recipe.id },
    take: page * 10,
    orderBy: { updatedAt: "desc" },
    include: { user: { include: { image: { select: { id: true } } } } },
  });
};
