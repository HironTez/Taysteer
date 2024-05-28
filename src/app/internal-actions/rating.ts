import { prisma } from "@/db";
import { actionError, actionResponse } from "@/utils/dto";
import { noop } from "@/utils/function";

const getRating = async (recipeId: string) => {
  const result = await prisma.recipeRating
    .aggregate({
      where: { recipeId },
      _count: true,
      _avg: { value: true },
    })

    .catch(noop);

  const value = result?._avg.value ?? 0;
  const count = result?._count ?? 0;

  return { value, count };
};

export const getRatingByUser = async (recipeId: string, userId: string) =>
  await prisma.recipeRating
    .findUnique({
      where: { userId_recipeId: { recipeId, userId } },
    })
    .then((rating) => rating?.value ?? null)

    .catch(noop);

export const uploadRating = async (
  value: number,
  recipeId: string,
  userId: string,
) => {
  try {
    const createdRating = await prisma.recipeRating.upsert({
      where: { userId_recipeId: { recipeId, userId } },
      create: {
        value,
        recipe: { connect: { id: recipeId } },
        user: { connect: { id: userId } },
      },
      update: {
        value,
      },
    });

    const calculatedRating = createdRating && (await getRating(recipeId));

    const updatedRecipe =
      calculatedRating &&
      (await prisma.recipe.update({
        where: { id: recipeId },
        data: { rating: calculatedRating },
      }));

    if (updatedRecipe) {
      return actionResponse(createdRating);
    }
  } catch {}

  return actionError("Could not publish rating");
};

export const deleteRating = async (recipeId: string, userId: string) =>
  await prisma.recipeRating
    .delete({
      where: { userId_recipeId: { recipeId, userId } },
    })

    .then(actionResponse)
    .catch(() => actionError("Could not delete rating"));
