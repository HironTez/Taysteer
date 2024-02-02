import { arrayConstructor } from "@/utils/array";
import { typeSafeObjectFromEntries } from "@/utils/object";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { image, imageOptional } from "./constants";

const createRecipeBase = z.object({
  title: zfd.text(
    z.string().max(50, "Title can be maximal 50 characters long"),
  ),
  description: zfd.text(
    z.string().max(500, "Description can be maximal 500 characters long"),
  ),
  image,
});

const editRecipeBase = z.object({
  title: zfd.text(
    z.string().max(50, "Title can be maximal 50 characters long"),
  ),
  description: zfd.text(
    z.string().max(500, "Description can be maximal 500 characters long"),
  ),
  image: imageOptional,
});

type CreateRecipeBaseSchemaT = z.infer<typeof createRecipeBase>;
type EditRecipeBaseSchemaT = z.infer<typeof editRecipeBase>;

export type RecipeIngredientT = {
  count: string;
  name: string;
  optional: boolean;
};

export type RecipeStepT = {
  id: string | undefined;
  title: string;
  description: string;
  image: File;
};

type IngredientsAndSchemaT = {
  ingredients: RecipeIngredientT[];
  steps: RecipeStepT[];
};

export type CreateRecipeDataT = CreateRecipeBaseSchemaT & IngredientsAndSchemaT;
type EditRecipeDataT = EditRecipeBaseSchemaT & IngredientsAndSchemaT;

export const getRecipeSchema = <
  IC extends number,
  SC extends number,
  Edit extends boolean,
>(
  ingredientsCount: IC,
  stepsCount: SC,
  edit: Edit,
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
        `step_${i}_id`,
        zfd.text(
          z
            .string()
            .min(24, "Step id must be 24 characters long")
            .max(24, "Step id must be 24 characters long")
            .optional(),
        ),
      ],
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
      [`step_${i}_image`, edit ? imageOptional : image],
    ]).flat(),
  );

  return zfd.formData(
    (edit ? editRecipeBase : createRecipeBase)
      .merge(z.object(ingredientsObjectSchema))
      .merge(z.object(stepsObjectSchema)),
  );
};

export type RecipeSchemaRawT = ReturnType<typeof getRecipeSchema>;
export type RecipeSchemaT = z.infer<RecipeSchemaRawT>;
