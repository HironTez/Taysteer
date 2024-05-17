import { prisma } from "@/db";
import { actionError, actionResponse } from "@/utils/dto";
import { noop } from "@/utils/function";

export const getComments = async (recipeId: string, page: number) =>
  await prisma.comment
    .findMany({
      where: { recipeId },
      take: page * 10,
      orderBy: { updatedAt: "desc" },
      include: { user: { include: { image: { select: { id: true } } } } },
    })

    .catch(noop);

export const getCommentsCount = async (recipeId: string) => {
  const result = await prisma.comment
    .aggregate({
      where: { recipeId },
      _count: true,
    })

    .catch(noop);

  return result?._count ?? 0;
};

export const createComment = async (
  text: string,
  recipeId: string,
  userId: string,
) =>
  await prisma.comment
    .create({
      data: {
        text,
        recipe: { connect: { id: recipeId } },
        user: { connect: { id: userId } },
      },
      include: { user: { include: { image: { select: { id: true } } } } },
    })

    .then(actionResponse)
    .catch(() => actionError("Could not publish comment"));

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
