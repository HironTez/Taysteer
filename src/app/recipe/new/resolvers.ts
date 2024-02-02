import { createRecipe } from "@/app/internal-actions/recipe";
import {
  RecipeSchemaRawT,
  RecipeSchemaT,
  RecipeIngredientT,
  RecipeStepT,
} from "@/app/schemas/recipe";
import { UserWithImage } from "@/types/Models";
import { zodError } from "@/utils/dto";

const extractIngredientsAndSteps = (data: RecipeSchemaT) => {
  const ingredients: RecipeIngredientT[] = [];
  const steps: RecipeStepT[] = [];

  for (let i = 0; i < Infinity; i++) {
    const ingredientCount = data[`ingredient_${i}_count`];
    const ingredientName = data[`ingredient_${i}_name`];
    const ingredientOptional = data[`ingredient_${i}_optional`];
    const ingredientValid =
      ingredientCount !== undefined &&
      ingredientName !== undefined &&
      ingredientOptional !== undefined;

    const stepTitle = data[`step_${i}_title`];
    const stepDescription = data[`step_${i}_description`];
    const stepImage = data[`step_${i}_image`];
    const stepValid =
      stepTitle !== undefined &&
      stepDescription !== undefined &&
      stepImage !== undefined;

    if (ingredientValid) {
      ingredients.push({
        count: ingredientCount,
        name: ingredientName,
        optional: ingredientOptional,
      });
    }
    if (stepValid) {
      steps.push({
        title: stepTitle,
        description: stepDescription,
        image: stepImage,
      });
    }

    if (!ingredientValid && !stepValid) break;
  }

  return { ingredients, steps };
};

export const resolveCreateRecipe = async <T extends RecipeSchemaRawT>(
  data: FormData,
  user: UserWithImage,
  createRecipeSchema: T,
) => {
  const parsed = createRecipeSchema.safeParse(data);
  if (!parsed.success) return zodError<T>(parsed.error);

  return await createRecipe(
    {
      title: parsed.data.title,
      description: parsed.data.description,
      image: parsed.data.image,
      ...extractIngredientsAndSteps(parsed.data),
    },
    user,
  );
};
