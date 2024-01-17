import { prisma } from "@/db";
import { actionResponse } from "@/utils/dto";
import { User } from "@prisma/client";
import { CreateRecipeDataT } from "../schemas/recipe";
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
};
