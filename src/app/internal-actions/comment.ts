import { prisma } from "@/db";
import { actionError, actionResponse } from "@/utils/dto";
import { noop } from "@/utils/function";
import { Recipe, User } from "@prisma/client";

export const getComments = async (recipe: Recipe, page: number) =>
  await prisma.comment
    .findMany({
      where: { recipeId: recipe.id },
      take: page * 10,
      orderBy: { updatedAt: "desc" },
      include: { user: { include: { image: { select: { id: true } } } } },
    })

    .catch(noop);

export const getCommentsCount = async (recipe: Recipe) => {
  const result = await prisma.comment
    .aggregate({
      where: { recipeId: recipe.id },
      _count: true,
    })

    .catch(noop);

  return result?._count ?? 0;
};

export const createComment = async (text: string, recipe: Recipe, user: User) =>
  await prisma.comment
    .create({
      data: {
        text,
        recipe: { connect: { id: recipe.id } },
        user: { connect: { id: user.id } },
      },
      include: { user: { include: { image: { select: { id: true } } } } },
    })

    .then(actionResponse)
    .catch(() => actionError("Could not create comment"));

export const editComment = async (id: string, text: string) =>
  await prisma.comment
    .update({
      where: { id },
      data: { text },
    })

    .then(actionResponse)
    .catch(() => actionError("Could not edit comment"));

export const deleteComment = async (id: string) =>
  await prisma.comment
    .delete({ where: { id } })

    .then(actionResponse)
    .catch(() => actionError("Could not delete comment"));
