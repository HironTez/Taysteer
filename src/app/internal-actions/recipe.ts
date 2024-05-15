import { prisma } from "@/db";
import { actionError, actionResponse } from "@/utils/dto";
import { Recipe, User } from "@prisma/client";
import { getURL } from "next/dist/shared/lib/utils";
import { redirect } from "next/navigation";
import { CreateRecipeDataT, EditRecipeDataT } from "../schemas/recipe";
import { getSessionUser } from "./auth";
import { getCreateImageVariable } from "./helpers";
import { checkAccess } from "./user";

export const getRecipe = (recipeId: string) => {
  return prisma.recipe.findUnique({
    where: { id: recipeId },
    include: {
      user: { include: { image: { select: { id: true } } } },
      image: { select: { id: true } },
      steps: { include: { image: { select: { id: true } } } },
    },
  });
};

export const createRecipe = async (
  { title, description, image, ingredients, steps }: CreateRecipeDataT,
  user: User,
) => {
  try {
    const recipe = await prisma.recipe.create({
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
      },
    });

    return actionResponse({ recipe });
  } catch {
    return actionError("Could not create recipe");
  }
};

export const editRecipe = async (
  id: string,
  { title, description, image, ingredients, steps }: EditRecipeDataT,
) => {
  try {
    const newRecipe = await prisma.recipe.update({
      where: { id },
      data: {
        title,
        description,
        image: await getCreateImageVariable(image),
        ingredients,
        steps: {
          update: await Promise.all(
            steps
              .filter((step) => step.id)
              .map(async (step) => ({
                where: {
                  id: step.id!,
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
    });

    return actionResponse({ recipe: newRecipe });
  } catch {
    return actionError("Could not edit recipe");
  }
};

export const deleteRecipe = async (recipe: Recipe) => {
  const sessionUser = await getSessionUser();
  const hasAccess = await checkAccess(sessionUser, recipe);
  if (!hasAccess) {
    return actionError("Forbidden");
  }

  try {
    await prisma.recipe.delete({ where: { id: recipe.id } });

    redirect(getURL());
  } catch {
    return actionError("Could not delete recipe");
  }
};
