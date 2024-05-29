import { prisma } from "@/db";
import { actionError, actionResponse } from "@/utils/dto";
import { noop } from "@/utils/function";
import { User } from "@prisma/client";
import { CreateRecipeDataT, EditRecipeDataT } from "../schemas/recipe";
import { getCreateImageVariable } from "./helpers";

export const getRecipes = async (
  page: number,
  userId?: string,
  favorites?: boolean,
) =>
  await (
    favorites && userId
      ? prisma.recipe.findMany({
          where: { favoriteOfUsersIds: { has: userId } },
          orderBy: { rating: { value: "desc" } }, // TODO: sort as well by count of ratings
          take: page * 10,
          skip: page * 10 - 10,
          include: { image: { select: { id: true } } },
        })
      : prisma.recipe.findMany({
          where: { ...(userId ? { userId } : null) },
          orderBy: { rating: { value: "desc" } }, // TODO: sort as well by count of ratings
          take: page * 10,
          skip: page * 10 - 10,
          include: { image: { select: { id: true } } },
        })
  ).catch(noop);

export const getRecipesCount = async (userId?: string) => {
  const result = await prisma.recipe
    .aggregate({
      where: { ...(userId ? { userId } : null) },
      _count: true,
    })

    .catch(noop);

  return result?._count ?? 0;
};

export const getRecipe = async (recipeId: string) =>
  await prisma.recipe
    .findUnique({
      where: { id: recipeId },
      include: {
        user: { include: { image: { select: { id: true } } } },
        image: { select: { id: true } },
        steps: { include: { image: { select: { id: true } } } },
      },
    })

    .catch(noop);

export const createRecipe = async (
  { title, description, image, ingredients, steps }: CreateRecipeDataT,
  user: User,
) =>
  await prisma.recipe
    .create({
      data: {
        title,
        description,
        image: await getCreateImageVariable(image),
        ingredients,
        steps: {
          create: await Promise.all(
            steps.map(async (step) => ({
              title: step.title,
              description: step.description,
              image: await getCreateImageVariable(step.image),
            })),
          ),
        },
        user: { connect: { id: user.id } },
        rating: { value: 0, count: 0 },
      },
    })

    .then(actionResponse)
    .catch(() => actionError("Could not publish recipe"));

export const editRecipe = async (
  id: string,
  { title, description, image, ingredients, steps }: EditRecipeDataT,
) =>
  await prisma.recipe
    .update({
      where: { id },
      data: {
        title,
        description,
        image: await getCreateImageVariable(image),
        ingredients,
        steps: {
          update: await Promise.all(
            steps
              .filter((step): step is typeof step & { id: string } => !!step.id)
              .map(async (step) => ({
                where: {
                  id: step.id,
                },
                data: {
                  title: step.title,
                  description: step.description,
                  image: await getCreateImageVariable(step.image),
                },
              })),
          ),
          create: await Promise.all(
            steps
              .filter((step) => !step.id)
              .map(async (step) => ({
                title: step.title,
                description: step.description,
                image: await getCreateImageVariable(step.image),
              })),
          ),
        },
      },
    })

    .then(actionResponse)
    .catch(() => actionError("Could not edit recipe"));

export const deleteRecipe = async (id: string) =>
  await prisma.recipe
    .delete({ where: { id } })

    .then(actionResponse)
    .catch(() => actionError("Could not delete recipe"));
