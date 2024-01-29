import { arrayConstructor } from "@/utils/array";
import { typeSafeObjectFromEntries } from "@/utils/object";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { image } from "./constants";

const createRecipeBase = z.object({
  title: zfd.text(
    z.string().max(50, "Title can be maximal 50 characters long"),
  ),
  description: zfd.text(
    z.string().max(500, "Description can be maximal 500 characters long"),
  ),
  image,
});

type CreateRecipeBaseSchemaT = z.infer<typeof createRecipeBase>;

export type RecipeIngredientT = {
  count: string;
  name: string;
  optional: boolean;
};

export type RecipeStepT = {
  title: string;
  description: string;
  image: File;
};

export type CreateRecipeDataT = CreateRecipeBaseSchemaT & {
  ingredients: RecipeIngredientT[];
  steps: RecipeStepT[];
};

export const getCreateRecipeSchema = <IC extends number, SC extends number>(
  ingredientsCount: IC,
  stepsCount: SC,
) => {
  const ingredientsObjectSchema = typeSafeObjectFromEntries(
    arrayConstructor(ingredientsCount, (i) => [
      [
        `ingredient_${i}_count`,
        zfd.text(
          z
            .string()
            .max(50, "Ingredient count can be maximal 50 characters long"),
        ),
      ],
      [
        `ingredient_${i}_name`,
        zfd.text(
          z
            .string()
            .max(250, "Ingredient name can be maximal 250 characters long"),
        ),
      ],
      [`ingredient_${i}_optional`, zfd.checkbox()],
    ]).flat(),
  );
  const stepsObjectSchema = typeSafeObjectFromEntries(
    arrayConstructor(stepsCount, (i) => [
      [
        `step_${i}_title`,
        zfd.text(
          z.string().max(50, "Step title can be maximal 50 characters long"),
        ),
      ],
      [
        `step_${i}_description`,
        zfd.text(
          z
            .string()
            .max(500, "Step description can be maximal 500 characters long"),
        ),
      ],
      [`step_${i}_image`, image],
    ]).flat(),
  );

  return zfd.formData(
    createRecipeBase
      .merge(z.object(ingredientsObjectSchema))
      .merge(z.object(stepsObjectSchema)),
  );
};

export type CreateRecipeSchemaRawT = ReturnType<typeof getCreateRecipeSchema>;
export type CreateRecipeSchemaT = z.infer<CreateRecipeSchemaRawT>;
