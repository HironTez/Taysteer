import { prisma } from "@/db";
import { actionError, actionResponse } from "@/utils/dto";
import { User } from "@prisma/client";
import { CreateRecipeDataT, EditRecipeDataT } from "../schemas/recipe";
import { getCreateImageVariable } from "./helpers";

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
